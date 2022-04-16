import { Module } from '@nestjs/common';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
import { ProductService } from './services/product/product.service';
import { ProductController } from './controllers/product/product.controller';

@Module({
  imports: [],
  controllers: [MobileController, ProductController],
  providers: [MobileService, ProductService],
})
export class MobileModule {}
