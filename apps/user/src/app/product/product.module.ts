import { HttpModule, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../database/database.module';
import { ProductRepo } from '../repositories/productRepo';
import { productProviders } from '../providers/product.providers';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, ...productProviders],
})
export class ProductModule {}
