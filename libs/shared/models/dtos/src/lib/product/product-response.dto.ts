import { Product, PRODUCT_VARIANTS } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty()
  originalUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  lastestCrawlAt: Date;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnail: string;

  // @ApiProperty()
  // isSale: boolean;

  // @ApiProperty()
  // salePrice: number;

  // @ApiProperty()
  // discountPercent: number;

  @ApiProperty()
  average: number;

  @ApiProperty()
  sold: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  merchant: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  variants: ProductVariantReponseDTO[];

  // @ApiProperty()
  // productUrl: string;

  public static fromEntity(entity: Partial<Product>) {
    const result = new ProductResponse();
    result.productId = entity.productId;
    result.name = entity.name;
    result.originalUrl = entity.originalUrl;
    result.thumbnail = entity.thumbnail;
    result.average = entity.average;
    result.sold = entity.sold;
    result.description = entity.description;
    result.merchant = entity.merchant;
    result.slug = entity.slug;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    result.lastestCrawlAt = entity.lastestCrawlAt;
    result.variants = entity?.variants?.map((variant) => ProductVariantReponseDTO.fromEntity(variant)) || [];

    return result;
  }

  public static fromEntities(entities: Partial<Product[]>) {
    const result: ProductResponse[] = [];
    for (const entity of entities) {
      const temp = new ProductResponse();
      temp.productId = entity.productId;
      temp.name = entity.name;
      temp.originalUrl = entity.originalUrl;
      temp.thumbnail = entity.thumbnail;
      temp.average = entity.average;
      temp.sold = entity.sold;
      temp.description = entity.description;
      temp.merchant = entity.merchant;
      temp.slug = entity.slug;
      temp.createdAt = entity.createdAt;
      temp.updatedAt = entity.updatedAt;
      temp.lastestCrawlAt = entity.lastestCrawlAt;
      temp.variants = entity?.variants?.map((variant) => ProductVariantReponseDTO.fromEntity(variant)) || [];

      result.push(temp);
    }
    return result;
  }
}

export class PagingProductResponse {
  @ApiProperty()
  total: number;

  @ApiProperty()
  data: ProductResponse[];

  public static from(total: number, data: Partial<Product[]>) {
    const result = new PagingProductResponse();
    result.total = total;
    result.data = ProductResponse.fromEntities(data);
    return result;
  }
}

export class ProductVariantReponseDTO {
  @ApiProperty()
  sku: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  variantName: string;

  @ApiProperty()
  variantImageUrl: string;

  @ApiProperty()
  listPrice: number;

  @ApiProperty()
  salePrice: number;

  @ApiProperty()
  isSale: boolean;

  @ApiProperty()
  discountPercent: number;

  @ApiProperty()
  images: string[];

  public static fromEntity(entity: Partial<PRODUCT_VARIANTS>) {
    const result = new ProductVariantReponseDTO();
    result.sku = entity.sku;
    result.productId = entity.productId;
    result.variantName = entity.variantName;
    result.variantImageUrl = entity.variantImageUrl;
    result.listPrice = entity.listPrice;
    result.salePrice = entity.salePrice;
    result.isSale = entity.isSale;
    result.discountPercent = entity.discountPercent;
    result.images = [];
    entity?.images?.map((image) => result.images.push(image.imageUrl));
    return result;
  }
}
