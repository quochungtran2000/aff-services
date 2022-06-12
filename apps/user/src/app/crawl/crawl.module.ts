import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { crawlProviders } from '../providers/crawl.providers';
import { crawlRepo } from '../repositories/crawlRepo';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CrawlController],
  providers: [CrawlService, crawlRepo, ...crawlProviders],
})
export class CrawlModule {}
