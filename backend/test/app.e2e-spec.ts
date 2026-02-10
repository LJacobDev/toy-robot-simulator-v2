import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/*
  WARNING: running this e2e test will delete the entire database

  USE ONLY IN DEVELOPMENT

  
  This is basic representative test set for now

  I would like to add e2e tests that cover:
  malformed requests, error and failure modes


  An example from Supertest documentation as reference 
  for the level of testing that I'd like to be including here

  describe('POST /users', function() {
    it('responds with json', function(done) {
      request(app)
        .post('/users')
        .send({name: 'john'})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });
*/

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/positions (GET) Returns 200 status code', () => {
    return request(app.getHttpServer())
      .get('/api/positions')
      .expect(200);
  });

  it('/api/positions (POST) Returns JSON response with 201 status code', () => {
    return request(app.getHttpServer())
      .post('/api/positions')
      .send({x:0, y:0, f:'North'})
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('/api/positions (DELETE) Returns 200 status code', () => {
    return request(app.getHttpServer())
      .delete('/api/positions')
      .expect(200);
  });

});


