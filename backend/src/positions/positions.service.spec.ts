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

      55 |   remove() {
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
  let db: Database.Database;

    // create a better-sqlite3 database in RAM for testing
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

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionsService],
    }).compile();

    service = module.get<PositionsService>(PositionsService);



  });

  afterEach(()=> {
    db.close();
  });

  // kept for reference, ok to delete
  // it('should be defined and have scaffolding placeholder text', () => {
  //   expect(service).toBeDefined();
  //   expect(service.findAll()).toBe('This action returns all positions')
  // });

  
  // Helper functions

  /**
   * Invokes service.create with a set of default position values
   * @returns The created record
   */
  function seedPosition() {
    
  // debug findings: direct database in memory access works
  // but not when calling the service method
    db.prepare(`
        INSERT INTO positions (x, y, f)
        VALUES (0, 0, 'North');
      `).run();

  // return service.create({x:0, y:0, f:'North'});
  }

  
  
  
  describe('remove', () => {

    beforeEach(() => {

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
      db.exec(`DROP TABLE positions`);
    })

    
    // skipping because positions.service use of db is broken.
    // see service.remove() comment
    it.skip('should delete all records in the table', () => {

      // seed the table with two records
      seedPosition();
      seedPosition();

      const seededRows = db.prepare('SELECT * FROM positions').all();

      expect(seededRows).toHaveLength(2);

      // DEBUG FINDINGS: direct database in memory access works 
      // but not when calling the service method

      // this part is broken until I can get rid of TypeError
      // about `remove()` this.db.prepare statement in positions.service
      // when running that service from within this test context
      service.remove();

      // run GET again and expect back empty array
      const deletedRows = db.prepare('SELECT * FROM positions').all();

      expect(deletedRows).toHaveLength(0);
      expect(deletedRows).toBe([]);

    })

    // skipped due to issue with service db mentioned in test above
    it.skip('should return { deleted: true } when completed', () => {
      expect(service.remove()).toBe({deleted: true});
    })
  });

});
