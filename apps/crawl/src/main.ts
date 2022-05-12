/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import * as compression from 'compression';

async function bootstrap() {
  const logger = new Logger(`MicroService-Crawl`);
  const app = await NestFactory.create(AppModule);
  app.use(compression());

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
      retryAttempts: 5,
      retryDelay: 1000 * 10,
    },
  });
  await app.startAllMicroservicesAsync();

  await app.listen(3009);

  logger.log(`Microservice is listening...`);
}

bootstrap();
