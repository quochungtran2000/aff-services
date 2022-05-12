import { CrawlCategoryResponse, EcommerceCategoryQuery } from '@aff-services/shared/models/dtos';
import { CRAWL_CATEGORY } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepo {
  private readonly logger = new Logger(`Micro-User.${CategoryRepo.name}`);
  constructor(@Inject('CRAWL_CATEGORY_REPOSITORY') private readonly crawlCategoryRepo: Repository<CRAWL_CATEGORY>) {}

  async getCateGories(query: EcommerceCategoryQuery) {
    this.logger.log(`${this.getCateGories.name} query:${JSON.stringify(query)}`);
    const { merchant } = query;
    const qr = this.crawlCategoryRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.subCategory', 'sub1')
      .leftJoinAndSelect('sub1.subCategory', 'sub2')
      .where('1=1')
      .andWhere('p.parent_id is null')
      .andWhere('p.merchant = :merchant');
    const data = await qr.setParameters({ merchant }).getMany();
    return CrawlCategoryResponse.fromEntities(data);
  }
}
