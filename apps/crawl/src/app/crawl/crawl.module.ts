import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { categoryProviders } from '../providers/category-providers';
import { configProviders } from '../providers/config.providers';
import { crawlProviders } from '../providers/crawl.providers';
import { productProviders } from '../providers/product.providers';
import { CategoryRepo } from '../repositories/categoryRepo';
import { ConfigRepo } from '../repositories/configRepo';
import { CrawlRepo } from '../repositories/crawlRepo';
import { ProductRepo } from '../repositories/productRepo';
import { CrawlController } from './crawl.controller';
import { CrawlService } from './crawl.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CrawlController],
  providers: [
    CrawlService,
    ProductRepo,
    ...productProviders,
    ConfigRepo,
    ...configProviders,
    CategoryRepo,
    ...categoryProviders,
    CrawlRepo,
    ...crawlProviders,
  ],
})
export class CrawlModule {}
