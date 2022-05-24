import { CreateProductDTO } from '@aff-services/shared/models/dtos';
import { Product } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepo {
  private readonly logger = new Logger(`Micro-Crawl.${ProductRepo.name}`);

  constructor(@Inject('PRODUCT_REPOSITORY') private readonly productRepo: Repository<Product>) {}

  async insertData(data: CreateProductDTO[]) {
    try {
      this.logger.log(`${this.insertData.name}`);
      return this.productRepo
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(data)
        .orUpdate(
          [
            'name',
            'is_complete_crawl',
            'is_complete_update',
            'originalUrl',
            'thumbnail',
            'average',
            'sold',
            'description',
            'merchant',
            'slug',
            'product_url',
            'updated_at',
            'lastest_crawl_at',
          ],
          ['product_id']
        )
        .orIgnore(true)
        .execute();
    } catch (error) {
      this.logger.error(`${this.insertData.name} error:${error.message}`);
    }
  }
}
