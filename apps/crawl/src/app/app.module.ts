import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlModule } from './crawl/crawl.module';
import { configProviders } from './providers/config.providers';
import { ConfigRepo } from './repositories/configRepo';

@Module({
  imports: [DatabaseModule, CrawlModule],
  controllers: [AppController],
  providers: [AppService, ConfigRepo, ...configProviders],
})
export class AppModule {}
