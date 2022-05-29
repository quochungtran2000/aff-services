import { Product, PRODUCT_VARIANTS } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantReponseDTO {
  @ApiProperty({ type: String, example: '123547428' })
  sku: string;

  @ApiProperty({ type: String, example: '123547395' })
  productId: string;

  @ApiProperty({ type: String, example: 'Hồng' })
  variantName: string;

  @ApiProperty({
    type: String,
    example: 'https://salt.tikicdn.com/cache/100x100/ts/product/a8/95/83/f78f7caa2f3c0b1032c04470e35be2c2.jpg.webp',
  })
  variantImageUrl: string;

  @ApiProperty({ type: Number, example: '2301203' })
  listPrice: number;

  @ApiProperty({ type: Number, example: '23123' })
  salePrice: number;

  @ApiProperty({ type: Boolean, example: true })
  isSale: boolean;

  @ApiProperty({ type: Number, example: 28 })
  discountPercent: number;

  @ApiProperty({
    type: String,
    isArray: true,
    example: [
      'https://salt.tikicdn.com/cache/100x100/ts/product/a8/95/83/f78f7caa2f3c0b1032c04470e35be2c2.jpg.webp',
      'https://salt.tikicdn.com/cache/100x100/ts/review/d8/9a/d7/984f5cdc411c2d39d67b816f6e6913a3.jpg.webp',
      'https://salt.tikicdn.com/cache/100x100/ts/review/8e/53/ab/d4b0c1bf8a662e222492a1309a705b70.jpg.webp',
      'https://salt.tikicdn.com/cache/100x100/ts/review/84/28/ba/fe46b9aeae9690c0d81ab67aa355abc8.jpg.webp',
      'https://salt.tikicdn.com/cache/100x100/ts/review/31/c1/29/dddfcb99a853c86e3397942070e2f804.jpg.webp',
    ],
  })
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

export class ProductResponse {
  @ApiProperty({ type: String, example: 'https://tiki.vn/dien-thoai-iphone-13-128gb-hang-chinh-hang-p123547395.html' })
  originalUrl: string;

  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  updatedAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  lastestCrawlAt: Date;

  @ApiProperty({ type: String, example: '123547395' })
  productId: string;

  @ApiProperty({ type: String, example: 'Điện Thoại iPhone 13 128GB  - Hàng  Chính Hãng' })
  name: string;

  @ApiProperty({
    type: String,
    example: 'https://salt.tikicdn.com/cache/200x200/ts/product/9e/44/ea/2b7ba151d4de1904beca5a66d383dad4.jpg',
  })
  thumbnail: string;

  @ApiProperty({ type: Number, example: 98 })
  average: number;

  @ApiProperty({ type: Number, example: '1239' })
  sold: number;

  @ApiProperty({ type: String, example: 'Thương hiệu: Apple; Xuất xứ thương hiệu: Mỹ; Xuất xứ: Trung Quốc' })
  description: string;

  @ApiProperty({ type: String, example: 'tiki' })
  merchant: string;

  @ApiProperty({ type: String, example: 'dien-thoai-iphone-13-128gb' })
  slug: string;

  @ApiProperty({ type: ProductVariantReponseDTO, isArray: true })
  variants: ProductVariantReponseDTO[];

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
