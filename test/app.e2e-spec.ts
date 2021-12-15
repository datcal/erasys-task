import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PasswordService } from '../src/password/password.service';
import { PasswordModule } from '../src/password/password.module';
import validation from '../config/validation';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PasswordModule,
        ConfigModule.forRoot({
          load: [validation],
          isGlobal: true,
          cache: false,
        }),
      ],
      providers: [PasswordService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  describe('checkPassword', () => {
    it('should return invalid - min 5', async () => {
      const response = await request(httpServer)
        .post('/passwords')
        .send({ password: '1Acb' });

      expect(response.status).toBe(400);
    });
    it('should return invalid - minimum 1 upppercase', async () => {
      const response = await request(httpServer)
        .post('/passwords')
        .send({ password: '1acba' });

      expect(response.status).toBe(400);
    });
    it('should return invalid -  3 and more repeating consecutive characters', async () => {
      const response = await request(httpServer)
        .post('/passwords')
        .send({ password: '1acbaaa' });

      expect(response.status).toBe(400);
    });
    it('should return invalid -  minimum 1 number', async () => {
      const response = await request(httpServer)
        .post('/passwords')
        .send({ password: 'Cacbaa' });
      expect(response.status).toBe(400);
    });
    it('should return valid', async () => {
      const response = await request(httpServer)
        .post('/passwords')
        .send({ password: 'abC12' });
      expect(response.status).toBe(204);
    });
  });
});
