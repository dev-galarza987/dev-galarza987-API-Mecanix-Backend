import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signin (POST) - Admin Login', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'admin@mecanix.com', password: 'adminpassword123' })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.user.role).toEqual('admin');
      });
  });

  it('/auth/signin (POST) - Invalid Credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'wrong@email.com', password: 'wrongpassword' })
      .expect(401);
  });
});
