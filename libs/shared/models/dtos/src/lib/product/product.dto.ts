import { removeAccent } from '@aff-services/shared/utils/helpers';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export type ProductVariant = {
  productId: string;
  sku: string;
  salePrice: string;
  listPrice: string;
  isSale: boolean;
  discountPercent: string;
  images: string[];
  skuName: string;
  skuImage: string;
};

export type ProductDetail = {
  categories: string[];
  comments: ProductComment[];
  productVariants: ProductVariant[];
  description: string;
  average?: number;
  sold?: number;
};

export type ProductComment = {
  customerName: string;
  customerSatisfactionLevel: string;
  reviewContent: string;
  reviewImages: string[];
};
export class CreateProductDTO {
  productId: string;
  name: string;
  slug: string;
  originalUrl: string;
  thumbnail: string;
  isCompleteCrawl: boolean;
  isCompleteUpdate: boolean;
  average: number;
  sold: number;
  description: string;
  merchant: string;
  createdAt: Date;
  updatedAt: Date;
  lastestCrawlAt: Date;

  public static from(dto: Partial<CreateProductDTO>) {
    const result = new CreateProductDTO();
    result.productId = dto.productId;
    result.name = dto.name;
    result.slug = getProductSlug(dto.name);
    result.originalUrl = dto.originalUrl;
    result.isCompleteCrawl = dto.isCompleteCrawl || false;
    result.isCompleteUpdate = dto.isCompleteUpdate || false;
    result.thumbnail = dto.thumbnail;
    result.average = Math.round(dto.average);
    result.sold = Math.round(dto.sold);
    result.description = dto.description;
    result.merchant = dto.merchant;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    result.lastestCrawlAt = new Date();
    return result;
  }

  public static fromArray(dtos: Partial<CreateProductDTO[]>) {
    const result: CreateProductDTO[] = [];
    for (const dto of dtos) {
      const temp = new CreateProductDTO();
      // dto.productName.startsWith('[') ? (productName = dto.productName.split(']')[1]) : (productName = dto.productName);
      // productName = productName
      //   .split('-')
      //   .shift()
      //   .split('|')
      //   .shift()
      //   .split(',')
      //   .shift()
      //   .split('(')
      //   .shift()
      //   .split('[')
      //   .shift()
      //   .trim();
      temp.productId = dto.productId;
      temp.thumbnail = dto.thumbnail;
      temp.average = Math.round(dto.average);
      temp.sold = Math.round(dto.sold);
      temp.slug = getProductSlug(dto.name);
      temp.name = dto.name;
      temp.originalUrl = dto.originalUrl;
      temp.isCompleteCrawl = dto.isCompleteCrawl || false;
      temp.isCompleteUpdate = dto.isCompleteUpdate || false;
      temp.description = dto.description;
      temp.merchant = dto.merchant;
      temp.createdAt = new Date();
      temp.updatedAt = new Date();
      temp.lastestCrawlAt = new Date();
      result.push(temp);
    }
    return result;
  }
}

const getProductSlug = (productName: string) => {
  let name = productName.split('-')[0].split('(')[0].trim();
  name = removeAccent(name);
  name = name?.toLocaleLowerCase().split(' ').join('-').replace(/-{2,}/g, '-');
  return name;
};

export class CrawlUpdateProductDetailDTO {
  productId: string;
  description: string;
  categoryId: string;
}

export class CrawlUpdateProductCommentDTO {
  content: string;
  customerName: string;
  customerSatisfactionLevel: string;
  productId: string;

  public static from(productId: string, dto: Partial<ProductComment>) {
    const result = new CrawlUpdateProductCommentDTO();
    result.productId = productId;
    result.customerName = dto.customerName;
    result.customerSatisfactionLevel = dto.customerSatisfactionLevel;
    result.content = dto.reviewContent;
    return result;
  }
}

export class CrawlUpdateProductCommentImageDTO {
  productCommentId: string;
  imageUrl: string;
}

export class CrawlUpdateProductVariantsDTO {
  productId: string;
  sku: string;
  salePrice: number;
  listPrice: number;
  discountPercent: number;
  isSale: boolean;
  variantName: string;
  variantImageUrl: string;

  public static from(productId: string, dto: Partial<ProductVariant>) {
    const result = new CrawlUpdateProductVariantsDTO();
    result.productId = productId?.replace(/[\D]/g, '');
    result.salePrice = Number(dto.salePrice?.replace(/[\D]/g, '') + '');
    result.listPrice = Number(dto.listPrice?.replace(/[\D]/g, '') + '');
    result.sku = dto.sku?.replace(/[\D]/g, '');
    result.discountPercent = Number(dto.discountPercent?.replace(/[\D]/g, '') + '');
    result.isSale = Boolean(dto.isSale) || false;
    result.variantName = dto.skuName || '';
    result.variantImageUrl = dto.skuImage || '';
    return result;
  }
}

export class CrawlUpdateProductVariantImage {
  id: number;
  productId: string;
  sku: string;
  imageUrl: string;
}

export class CreateAffLinkPayload {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'ád' })
  productUrl: string;
}

export class CreateProductDTOV2 {
  productId: string;
  name: string;
  slug: string;
  originalUrl: string;
  thumbnail: string;
  isCompleteCrawl: boolean;
  isCompleteUpdate: boolean;
  average: number;
  sold: number;
  description: string;
  merchant: 'tiki' | 'shopee' | 'lazada';
  crawlCategoryId: string;
  createdAt: Date;
  updatedAt: Date;
  lastestCrawlAt: Date;

  public static tobeCreated(dto: Partial<CreateProductDTOV2>) {
    const result = new CreateProductDTOV2();
    result.productId = getProductId(dto.originalUrl);
    result.name = dto.name;
    result.slug = getProductSlug(dto.name);
    result.originalUrl = OriginURL[dto.merchant](dto.originalUrl);
    result.thumbnail = dto.thumbnail;
    result.merchant = dto.merchant;
    result.crawlCategoryId = dto.crawlCategoryId;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    result.isCompleteCrawl = false;
    result.isCompleteUpdate = false;
    result.lastestCrawlAt = new Date();
    return result;
  }
  public static tobeCreateds(dtos: Partial<CreateProductDTOV2[]>) {
    return dtos.map((x) => this.tobeCreated(x));
  }
}

const getProductId = (url: string) => {
  const [productId] = url.match(/(p[0-9]{1,}.html)|(-i.[0-9]{1,}.)/);
  return productId?.replace(/[-iphtml.]{1,}/g, '');
};

const OriginURL = {
  tiki: (url: string) => {
    let result;
    if (url.startsWith('//tka.tiki.vn')) {
      result = url.replace('//tka.tiki.vn', 'https://tka.tiki.vn');
    } else {
      result = `https://tiki.vn${url}`;
    }
    return result;
  },
  shopee: (url: string) => {
    return `https://shopee.vn${url}`;
  },
  lazada: (url: string) => {
    let result;
    if (url.startsWith('//www.lazada.vn')) {
      result = url.replace('//www.lazada.vn', 'https://www.lazada.vn');
    } else {
      result = `https://www.lazada.vn${url}`;
    }
    return result;
  },
};
