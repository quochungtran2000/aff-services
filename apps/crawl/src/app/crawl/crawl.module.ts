import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { productProviders } from '../providers/product.providers';
import { ProductRepo } from '../repositories/productRepo';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CrawlController],
  providers: [CrawlService, ProductRepo, ...productProviders],
})
export class CrawlModule {}
