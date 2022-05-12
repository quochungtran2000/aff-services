import { CRAWL_CATEGORY } from '@aff-services/shared/models/entities';
import { removeAccent } from '@aff-services/shared/utils/helpers';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export type TCrawlCategory = {
  name: string;
  slug: string;
  subCategory?: TCrawlCategory[];
};

export class CrawlCategoryDTO {
  crawlCategoryId: string;
  merchant: string;
  title: string;
  slug: string;
  parentId: string;

  public static fromTikiCategory(data: Partial<TCrawlCategory>) {
    const result = new CrawlCategoryDTO();
    result.crawlCategoryId = data.slug.split('/').pop();
    result.merchant = 'tiki';
    result.title = data.name;
    result.slug = data.slug.replace('https://tiki.vn', '');
    result.parentId = null;
    return result;
  }

  public static fromTikiSubCategory(data: Partial<TCrawlCategory[]>, parentId: string) {
    const result: CrawlCategoryDTO[] = [];
    data.map((cate) => {
      const element = new CrawlCategoryDTO();
      element.crawlCategoryId = cate.slug.split('/').pop();
      element.merchant = 'tiki';
      element.title = cate.name;
      element.slug = cate.slug.replace('https://tiki.vn', '');
      element.parentId = parentId;
      result.push(element);
    });

    return result;
  }

  public static fromShopeeCategory(data: Partial<TCrawlCategory>) {
    const result = new CrawlCategoryDTO();
    result.crawlCategoryId = data.slug.split('.').pop();
    result.merchant = 'shopee';
    result.title = data.name;
    result.slug = data.slug;
    result.parentId = null;
    return result;
  }

  public static fromShopeeSubCategory(data: Partial<TCrawlCategory[]>, parentId: string) {
    const result: CrawlCategoryDTO[] = [];
    data.map((cate) => {
      const element = new CrawlCategoryDTO();
      element.crawlCategoryId = cate.slug.split('.').pop();
      element.merchant = 'shopee';
      element.title = cate.name;
      element.slug = cate.slug;
      element.parentId = parentId;
      result.push(element);
    });

    return result;
  }

  public static fromLazadaCategory(data: Partial<TCrawlCategory>) {
    const result = new CrawlCategoryDTO();
    result.merchant = 'lazada';
    result.title = data.name;
    const slug = removeAccent(data.name).toLowerCase().trim().split(' ').join('-');
    result.slug = `/${slug}`;
    result.parentId = null;
    result.crawlCategoryId = `i${slug}`;
    return result;
  }

  public static fromLazadaSubCategory(data: Partial<TCrawlCategory[]>, parentId: string) {
    const result: CrawlCategoryDTO[] = [];
    data.map((cate) => {
      const element = new CrawlCategoryDTO();
      const slug = cate.slug.endsWith('/') ? cate.slug.slice(0, -1) : cate.slug;
      element.crawlCategoryId = slug.split('/').pop();
      element.merchant = 'lazada';
      element.title = cate.name;
      element.slug = slug.replace('//www.lazada.vn', '');
      element.parentId = parentId;
      result.push(element);
    });

    return result;
  }
}

export class CrawlCategoryResponse {
  @ApiProperty({ type: String, example: 'iasd' })
  id: string;

  @ApiProperty({ type: String, example: 'example title' })
  title: string;

  @ApiProperty({ type: String, example: 'example slug' })
  slug: string;

  @ApiProperty({ type: String, example: false })
  active: boolean;

  @ApiProperty({ type: String, example: false })
  crawl: boolean;

  @ApiProperty({ type: CrawlCategoryResponse, isArray: true })
  subCategory?: CrawlCategoryResponse[];

  public static fromEntity(entity: Partial<CRAWL_CATEGORY>) {
    const result = new CrawlCategoryResponse();
    result.id = entity.crawlCategoryId;
    result.title = entity.title;
    result.slug = entity.slug;
    result.active = entity.active;
    result.crawl = entity.crawl;
    result.subCategory = [];
    if (entity?.subCategory?.length) {
      for (const elm of entity.subCategory) {
        result.subCategory.push(this.fromEntity(elm));
      }
    }
    if (!result.subCategory.length) delete result.subCategory;
    return result;
  }

  public static fromEntities(entities: Partial<CRAWL_CATEGORY[]>) {
    const result: CrawlCategoryResponse[] = [];
    for (const entity of entities) {
      const temp = CrawlCategoryResponse.fromEntity(entity);
      result.push(temp);
    }
    return result;
  }
}

export enum MerchantEnum {
  TIKI = 'tiki',
  LAZADA = 'lazada',
  SHOPEE = 'shopee',
}
export class EcommerceCategoryQuery {
  @ApiProperty({ required: true, enum: MerchantEnum })
  @IsNotEmpty()
  @IsIn([MerchantEnum.LAZADA, MerchantEnum.SHOPEE, MerchantEnum.TIKI])
  merchant: MerchantEnum;
}
