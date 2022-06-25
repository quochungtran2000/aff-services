import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from '../../database/database.module';
import { ProductRepo } from '../repositories/productRepo';
import { productProviders } from '../providers/product.providers';
import { ConfigRepo } from '../repositories/configRepo';
import { configProviders } from '../providers/config.providers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    // HttpModule.registerAsync({
    //   imports: [DatabaseModule],
    //   useFactory: async (configRepo: ConfigRepo) => ({
    //     baseURL: 'https://pub2-api.accesstrade.vn/v1',
    //     headers: { Authorization: await configRepo.getOneByName('access_trader_token') },
    //     timeout: 5000,
    //     maxRedirects: 5,
    //   }),
    //   inject: [ConfigRepo],
    //   extraProviders: [ConfigRepo, ...configProviders],
    // }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      insecureHTTPParser: true,
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepo, ...productProviders, ConfigRepo, ...configProviders],
})
export class ProductModule {}
