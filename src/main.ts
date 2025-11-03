import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import * as morgan from 'morgan';
import 'dotenv/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path/win32';
import { NestExpressApplication } from '@nestjs/platform-express';
/*
console.log(
  `Host: Type: ${typeof process.env.DB_HOST} Value: ${process.env.DB_HOST}`,
  `Port: Type: ${typeof process.env.DB_PORT} Value: ${process.env.DB_PORT}`,
  `Username: Type: ${typeof process.env.DB_USERNAME} Value: ${process.env.DB_USERNAME}`,
  `Password: Type: ${typeof process.env.DB_PASSWORD} Value: ${process.env.DB_PASSWORD}`,
  `Database: Type: ${typeof process.env.DB_DATABASE} Value: ${process.env.DB_DATABASE}`,
);*/
async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api/' + process.env.API_VERSION);
    app.use(morgan.default('dev'));

    const config = new DocumentBuilder()
      .setTitle('Documentación API Mecanix')
      .setDescription('La descripción de la API de Mecanix')
      .setVersion('1.0')
      .addTag('mecanix')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    await app.listen(process.env.PORT ?? 3000);
    console.log(
      `Server listening on  http://127.0.0.1:${process.env.PORT ?? 3000}/api/${process.env.API_VERSION}`,
    );
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}
void bootstrap();
