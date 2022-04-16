import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';

@Module({
  controllers: [WebsiteController, ProductController],
  providers: [WebsiteService, ProductService],
})
export class WebsiteModule {}
