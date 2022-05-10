import { removeAccent } from '@aff-services/shared/utils/helpers';

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
