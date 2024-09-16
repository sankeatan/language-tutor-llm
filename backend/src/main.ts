import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Language AI Tutor Example')
  .setDescription('AI Language Tutor API description')
  .setVersion('0.1')
  .addTag('language')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  
  //Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',  // frontend's URL
    credentials: true,
  });

  // Enable validation globally (optional but recommended)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(4000);
}
bootstrap();
