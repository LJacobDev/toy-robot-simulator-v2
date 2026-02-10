import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import Database from 'better-sqlite3';

@Injectable()
export class PositionsService implements OnModuleDestroy, OnModuleInit{
  private db: Database.Database;

  onModuleInit() {
    this.db = new Database('./data/database.sqlite');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      f TEXT NOT NULL,
      createdAt TEXT NOT NULL
      )
      `)
  }

  onModuleDestroy() {
    if (this.db)
      this.db.close();
  }

  create(createPositionDto: CreatePositionDto) {
    return 'This action adds a new position';
  }

  findAll() {
    return `This action returns all positions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} position`;
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return `This action updates a #${id} position`;
  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}
