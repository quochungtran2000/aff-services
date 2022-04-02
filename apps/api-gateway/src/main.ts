/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from './app/admin/admin.module';
import { AppModule } from './app/app.module';
import { AuthModule } from './app/auth/auth.module';
import { config } from './app/config/configurations';
import { AllExceptionsFilter } from './app/middlewares/http-exception.filter';
import { MobileModule } from './app/mobile/mobile.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = config.application.port;
  const globalPrefix = 'api/v1';

  const configAdmin = new DocumentBuilder()
    .setTitle('AFF-Services Admin Document Api')
    .setDescription('The AFF-Services Admin document API description.')
    .setVersion('1.0')
    .addTag('AFF-Services Admin API')
    .addServer(config.application.documentUrl)
    .build();

  const documentAdmin = SwaggerModule.createDocument(app, configAdmin, {
    include: [AdminModule, AuthModule],
  });
  SwaggerModule.setup(`${globalPrefix}/document/admin`, app, documentAdmin);

  const configMobile = new DocumentBuilder()
    .setTitle('AFF-Services Mobile Document Api')
    .setDescription('The AFF-Services Mobile document API description.')
    .setVersion('1.0')
    .addTag('AFF-Services Mobile API')
    .addServer(config.application.documentUrl)
    .build();

  const documentMobile = SwaggerModule.createDocument(app, configMobile, {
    include: [MobileModule, AuthModule],
  });
  SwaggerModule.setup(`${globalPrefix}/document/mobile`, app, documentMobile);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(globalPrefix);
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
