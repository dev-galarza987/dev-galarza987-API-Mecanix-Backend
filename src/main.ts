import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import morgan from 'morgan';
import 'dotenv/config';
/*
console.log(
  `Host: Type: ${typeof process.env.DB_HOST} Value: ${process.env.DB_HOST}`,
  `Port: Type: ${typeof process.env.DB_PORT} Value: ${process.env.DB_PORT}`,
  `Username: Type: ${typeof process.env.DB_USERNAME} Value: ${process.env.DB_USERNAME}`,
  `Password: Type: ${typeof process.env.DB_PASSWORD} Value: ${process.env.DB_PASSWORD}`,
  `Database: Type: ${typeof process.env.DB_DATABASE} Value: ${process.env.DB_DATABASE}`,
);*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/' + process.env.API_VERSION);
  app.use(morgan('dev'));
  await app.listen(process.env.PORT ?? 8000);
  console.log(
    `Server listening on  http://127.0.0.1:${process.env.PORT ?? 8000}/api/${process.env.API_VERSION}`,
  );
}
void bootstrap();
