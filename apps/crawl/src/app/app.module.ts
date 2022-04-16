import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlModule } from './crawl/crawl.module';

@Module({
  imports: [DatabaseModule, CrawlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
