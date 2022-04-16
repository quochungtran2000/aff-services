import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../database/database.module';
import { ProductRepo } from '../repositories/productRepo';
import { productProviders } from '../providers/product.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, ...productProviders],
})
export class ProductModule {}
