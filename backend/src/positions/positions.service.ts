import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import Database from 'better-sqlite3';
import { last } from 'rxjs';

@Injectable()
export class PositionsService implements OnModuleDestroy, OnModuleInit {
  db: Database.Database;

  onModuleInit() {
    this.db = new Database('./data/database.sqlite');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS positions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        x INTEGER NOT NULL,
        y INTEGER NOT NULL,
        f TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `)
  }

  onModuleDestroy() {
    if (this.db)
      this.db.close();
  }

  /**
   * Creates a new record of a position in the database
   * 
   * @param createPositionDto the DTO class that gives the request body 
   * its required shape of `{x: number, y: number, f: string}`
   * 
   * Parameter `f` is short for 'facing' and the only possible values are 'North',
   * 'South', 'East', 'West'
   * 
   * @returns the latest position history record with id and createdAt provided by database
   */
  create(createPositionDto: CreatePositionDto) {

    // First, run a SQL query to insert the record
    const stmt = this.db.prepare(`
        INSERT INTO positions (x, y, f)
        VALUES (?, ?, ?);
      `)

    const postResult = stmt.run(
      createPositionDto.x,
      createPositionDto.y,
      createPositionDto.f
    );

    // Second, retrieve the last created row to return it to client 
    // with proof of database-produced id and timestamp
    const lastInsertedRecord = this.db.prepare(`
      SELECT * FROM positions WHERE id = ?
      `).get(postResult.lastInsertRowid);

    return lastInsertedRecord;
  }

  /**
   * Find all historical positions
   * 
   * @returns Array of all available position records as JSON objects 
   * such as `[{"x":"0","y":"0","f":"North"}]`, or `[]` if empty.
   * 
   * The last record available in the array is the most recent position,
   * which is used to restore the robot's location on game reload.
   * If ever uncertain about whether rows are in correct order,
   * refer to createdAt field to verify.
   */
  findAll() {
    const stmt = this.db.prepare(`SELECT * FROM positions`)
    const result = stmt.all();

    return result;
  }

  /**
   * Removes ALL historical position history to allow clearing game data
   * 
   * @returns `{ deleted:true }` upon running successfully, otherwise `500 Internal Server Error`
   */
  remove() {

    const stmt = this.db.prepare(`DELETE FROM positions`)

    stmt.run();

    return { deleted: true };
  }

  /**
   * findOne is being included not for the public API, but so that
   * it can be used by create to get a return value
   * @param id The id of the record in the table to retrieve
   * @returns record of position history {x: number, y: number, f: string}
   */
  findOne(id: number) {
    // Currently not required as `create` has its own implementation to get last record
    // This is being left in for a potential refactor to move that code here
    return `This action returns a #${id} position`;
  }

  /**
   * Update method intentionally not implemented
   * 
   * There is no need to update existing historical positions.
   * This was created while generating resource, and is being
   * left in to show that decision and as well as in case of future need.
   */
  update(id: number, updatePositionDto: UpdatePositionDto) {
    return `This action updates a #${id} position`;
  }

}
