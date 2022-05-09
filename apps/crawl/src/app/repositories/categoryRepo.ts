import { CrawlCategoryDTO, TCrawlCategory } from '@aff-services/shared/models/dtos';
import { CRAWL_CATEGORY } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepo {
  private readonly logger = new Logger(`Micro-Crawl.${CategoryRepo.name}`);
  constructor(@Inject('CRAWL_CATEGORY_REPOSITORY') private readonly crawlCategoryRepo: Repository<CRAWL_CATEGORY>) {}

  async insertOrUpdateOne(data: CrawlCategoryDTO[] | CrawlCategoryDTO) {
    try {
      this.logger.log(`${this.insertOrUpdateOne.name} called Data:${JSON.stringify(data)}`);
      return await this.crawlCategoryRepo
        .createQueryBuilder()
        .insert()
        .into(CRAWL_CATEGORY)
        .values(data)
        .orUpdate(['merchant', 'title', 'slug', 'parent_id'], ['crawl_category_id'])
        .orIgnore(true)
        .returning('*')
        .execute();
    } catch (error) {
      this.logger.error(`${this.insertOrUpdateOne.name} Error:${error.message}`);
    }
  }

  async updateCrawlTikiCategory(data: TCrawlCategory[]) {
    try {
      this.logger.log(`${this.updateCrawlTikiCategory.name} called`);
      //lv1
      for (const elm of data) {
        try {
          const dataCategory = CrawlCategoryDTO.fromTikiCategory(elm);
          const { generatedMaps } = await this.insertOrUpdateOne(dataCategory);
          const { crawlCategoryId } = generatedMaps[0];

          if (elm?.subCategory?.length) {
            const dataSubCategory = CrawlCategoryDTO.fromTikiSubCategory(elm.subCategory, crawlCategoryId);
            await this.insertOrUpdateOne(dataSubCategory);
          }
        } catch (error) {
          this.logger.error(`Update Category Error: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`${this.updateCrawlTikiCategory.name} Error:${error.message}`);
    }
  }

  async updateCrawlShopeeCategory(data: TCrawlCategory[]) {
    try {
      this.logger.log(`${this.updateCrawlShopeeCategory.name} called`);
      //lv1
      for (const elm of data) {
        try {
          const dataCategory = CrawlCategoryDTO.fromShopeeCategory(elm);
          const { generatedMaps } = await this.insertOrUpdateOne(dataCategory);
          const { crawlCategoryId } = generatedMaps[0];

          if (elm?.subCategory?.length) {
            const dataSubCategory = CrawlCategoryDTO.fromShopeeSubCategory(elm.subCategory, crawlCategoryId);
            await this.insertOrUpdateOne(dataSubCategory);
          }
        } catch (error) {
          this.logger.error(`Update Category Error: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`${this.updateCrawlShopeeCategory.name} Error:${error.message}`);
    }
  }

  async updateCrawlLazadaCategory(data: TCrawlCategory[]) {
    try {
      this.logger.log(`${this.updateCrawlLazadaCategory.name} called`);
      //lv1
      for (const elm of data) {
        try {
          const dataCategory = CrawlCategoryDTO.fromLazadaCategory(elm);
          const { generatedMaps: mapLv1 } = await this.insertOrUpdateOne(dataCategory);
          const { crawlCategoryId: lv1Id } = mapLv1[0];

          if (elm?.subCategory?.length) {
            // const dataSubCategory = CrawlCategoryDTO.fromLazadaSubCategory(elm.subCategory, lv1Id);
            for (const lv2 of elm.subCategory) {
              try {
                const [dataInsert] = CrawlCategoryDTO.fromLazadaSubCategory([lv2], lv1Id);
                const { generatedMaps: mapLv2 } = await this.insertOrUpdateOne(dataInsert);
                const { crawlCategoryId: lv2Id } = mapLv2[0];

                if (lv2.subCategory?.length) {
                  try {
                    const lv3 = CrawlCategoryDTO.fromLazadaSubCategory(lv2.subCategory, lv2Id);
                    await this.insertOrUpdateOne(lv3);
                  } catch (error) {
                    this.logger.error(`Update Lv3 Category Error: ${error.message}`);
                  }
                }
              } catch (error) {
                this.logger.error(`Update Lv2 Category Error: ${error.message}`);
              }
            }
          }
        } catch (error) {
          this.logger.error(`Update Category Error: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`${this.updateCrawlLazadaCategory.name} Error:${error.message}`);
    }
  }
}
