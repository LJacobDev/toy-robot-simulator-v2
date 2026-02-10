import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import Database from 'better-sqlite3';


/*

  Service unit tests are having issue with database:

  My method seems to not be able to access the database inside the unit tests 
	
  But the method works in normal app running, and in manual testing

  So I'm leaving these tests as representative of what they would be checking for until I fix it

  Error example:

  ● PositionsService › remove › should return { deleted: true } when completed

    TypeError: Cannot read properties of undefined (reading 'prepare')

      55 |   removeAll() {
      56 |     
    > 57 |     const stmt = this.db.prepare(`DELETE FROM positions`)
         |                          ^
      58 |     
      59 |     stmt.run();
      60 |

      at PositionsService.remove (positions/positions.service.ts:57:26)
      at Object.<anonymous> (positions/positions.service.spec.ts:62:22)

 */




describe('PositionsService', () => {
  let service: PositionsService;

  // create a better-sqlite3 database in RAM for testing
  let db: Database.Database;


  beforeEach(async () => {

    db = new Database(':memory:');

    db.exec(`
        CREATE TABLE IF NOT EXISTS positions(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          x INTEGER NOT NULL,
          y INTEGER NOT NULL,
          f TEXT NOT NULL,
          createdAt DEFAULT CURRENT_TIMESTAMP
        );
      `);


    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsService],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  afterEach(() => {
    db.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  // Helper functions

  /**
   * Invokes service.create with a set of default position values
   * @returns The created record
   */
  function seedPosition() {
    db.prepare(`
        INSERT INTO positions (x, y, f)
        VALUES (0, 0, 'North');
      `).run();
  }




  describe('removeAll', () => {

    beforeEach(() => {

      db = new Database(':memory:');

      db.exec(`
        CREATE TABLE IF NOT EXISTS positions(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          x INTEGER NOT NULL,
          y INTEGER NOT NULL,
          f TEXT NOT NULL,
          createdAt DEFAULT CURRENT_TIMESTAMP
        );
      `);

    })

    afterEach(() => {
      db.close();
    })


    it('should delete all records in the table', () => {

      // seed the table with two records
      seedPosition();
      seedPosition();

      const seededRows = db.prepare('SELECT * FROM positions').all();
      expect(seededRows).toHaveLength(2);

      // DEBUG FINDINGS: database in memory works here,
      // database fails inside the service method when calling it

      // This service.removeAll() line was broken due to:
      // `TypeError: Cannot read properties of undefined (reading 'prepare')`
      // Caused by statement: `this.db.prepare()` in positions.service.ts
      // when running that service from within this test context

      // Solution for now:
      // Pass db in as a new optional argument to method.
      // removeAll() (and other methods) have been updated to use it
      service.removeAll(db);

      // run GET again and expect back empty array
      const deletedRows = db.prepare('SELECT * FROM positions').all();

      expect(deletedRows).toHaveLength(0);
      expect(deletedRows).toStrictEqual([]);

    })

    // skipped due to issue with service db mentioned in test above
    it('should return { deleted: true } when completed', () => {
      expect(service.removeAll(db)).toStrictEqual({ deleted: true });
    })
  });


  describe('findAll', () => {

    beforeEach(() => {

      db = new Database(':memory:');

      db.exec(`
        CREATE TABLE IF NOT EXISTS positions(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          x INTEGER NOT NULL,
          y INTEGER NOT NULL,
          f TEXT NOT NULL,
          createdAt DEFAULT CURRENT_TIMESTAMP
        );
      `);

    });

    afterEach(() => {
      db.close();
    });


    it('should return an empty data array if no records', () => {

      const serviceRows = service.findAll(db);
      expect(serviceRows).toHaveLength(0);

    });

    it('should return an array of records if there are any', () => {

      // seed the table with two records
      seedPosition();
      seedPosition();

      const serviceRows = service.findAll(db);
      expect(serviceRows).toHaveLength(2);
      expect(serviceRows[0].x).toBe(0);
      expect(serviceRows[1].x).toBe(0);
    });



  });


  describe('create', () => {

    beforeEach(() => {

      db = new Database(':memory:');

      db.exec(`
        CREATE TABLE IF NOT EXISTS positions(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          x INTEGER NOT NULL,
          y INTEGER NOT NULL,
          f TEXT NOT NULL,
          createdAt DEFAULT CURRENT_TIMESTAMP
        );
      `);

    });

    afterEach(() => {
      db.close();
    });


    it('Returns the object created', () => {
      expect(true).toBe(false);
    });

  });
});
