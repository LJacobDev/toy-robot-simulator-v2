import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import Database from 'better-sqlite3';

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

  /**
   * Generates a body payload that can be sent to create
   * @params  x, y, f are all optional and will default to 0, 0, 'North' if not specified
   * @returns The prepared body payload
   */
  function generatePosition(x?: number, y?: number, f?: string) {
    return { x: x ?? 0, y: y ?? 0, f: f ?? 'North' }
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

      const dto = generatePosition(1,1,'East');

      const result = service.create(dto, db);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.x).toBe(1);
      expect(result.y).toBe(1);
      expect(result.f).toBe('East');
      expect(result.createdAt).toBeDefined();

    });

  });
});
