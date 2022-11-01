import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.API_PORT
  const logger = new Logger('NestApplication')

  const config = new DocumentBuilder()
  .setTitle('RuNotes')
  .setDescription('there are notes description')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors()
  app.use(cookieParser())

  await app.listen(PORT, ()=>logger.warn('PORT: '+PORT));
}
bootstrap();
