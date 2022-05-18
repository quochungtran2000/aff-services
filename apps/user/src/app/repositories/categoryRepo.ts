import {
  BaseResponse,
  CategoryResponse,
  CrawlCategoryResponse,
  CreateCategoryDTO,
  EcommerceCategoryQuery,
  UpdateEcommerceCategoryDTO,
} from '@aff-services/shared/models/dtos';
import { CATEGORY, CRAWL_CATEGORY, MAPPING_CATEGORY } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepo {
  private readonly logger = new Logger(`Micro-User.${CategoryRepo.name}`);
  constructor(
    @Inject('CRAWL_CATEGORY_REPOSITORY') private readonly crawlCategoryRepo: Repository<CRAWL_CATEGORY>,
    @Inject('CATEGORY_REPOSITORY') private readonly categoryRepo: Repository<CATEGORY>,
    @Inject('MAPPING_CATEGORY_REPOSITORY') private readonly mappingCategoryRepo: Repository<MAPPING_CATEGORY>
  ) {}

  async getCateGories(query: EcommerceCategoryQuery): Promise<CrawlCategoryResponse[]> {
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

  async updateEcommerceCategory(data: UpdateEcommerceCategoryDTO): Promise<BaseResponse> {
    try {
      this.logger.log(`${this.updateEcommerceCategory.name} data:${JSON.stringify(data)}`);
      const { id, ...update } = data;
      await this.crawlCategoryRepo
        .createQueryBuilder()
        .update(CRAWL_CATEGORY)
        .set(update)
        .where(`crawl_category_id = :id`)
        .setParameters({ id })
        .execute();
      return { status: 200, message: 'Cập nhật thành công' };
    } catch (error) {
      this.logger.error(`${this.updateEcommerceCategory.name} error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }

  async insertAndReturnCategory(data: CreateCategoryDTO) {
    const { mapCategory, ...createData } = data;
    return await this.categoryRepo
      .createQueryBuilder()
      .insert()
      .into(CATEGORY)
      .values(createData)
      .returning('*')
      .execute();
  }

  async findOneCrawlCategoryById(id: string) {
    return this.crawlCategoryRepo
      .createQueryBuilder()
      .where('UPPER(crawl_category_id) = UPPER(:id)')
      .setParameters({ id })
      .getOne();
  }

  async insertMappingCategory(data: MAPPING_CATEGORY | MAPPING_CATEGORY[]) {
    return this.mappingCategoryRepo.createQueryBuilder().insert().into(MAPPING_CATEGORY).values(data).execute();
  }

  async createCategory(data: CreateCategoryDTO) {
    try {
      this.logger.log(`${this.createCategory.name} data:${JSON.stringify(data)}`);

      const { generatedMaps } = await this.insertAndReturnCategory(data);
      const created = generatedMaps[0] as CATEGORY;

      const toBeCreate: MAPPING_CATEGORY[] = [];

      for (const elm of data.mapCategory) {
        const exists = await this.findOneCrawlCategoryById(elm);
        if (exists) toBeCreate.push({ categoryId: created.categoryId, crawlCategoryId: exists.crawlCategoryId });
      }

      await this.insertMappingCategory(toBeCreate);

      return { message: 'Create category', status: 201 };
    } catch (error) {
      this.logger.error(`${this.createCategory.name} error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }

  async getCategory() {
    try {
      this.logger.log(`${this.getCategory.name} called`);

      const data = await this.categoryRepo
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.mappingCategory', 'mc')
        .leftJoinAndSelect('mc.crawlCategory', 'cr')
        .getMany();

      return CategoryResponse.fromEntities(data);
    } catch (error) {
      this.logger.error(`${this.getCategory.name} error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }
}
