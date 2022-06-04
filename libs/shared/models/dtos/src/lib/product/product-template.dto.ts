import { Product, PRODUCT_TEMPLATE } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ProductResponse } from './product-response.dto';

export class CreateProductTemplateDTO {
  productTemplateId: number;
  productName: string;
  productShortName: string;
  thumbnail: string;
  slug: string;
  slug1: string;
  createdAt: Date;
  updatedAt: Date;

  public static fromProduct(entity: Partial<Product>) {
    const result = new CreateProductTemplateDTO();
    result.productName = entity.name;
    result.productShortName = entity.slug;
    result.thumbnail = entity.thumbnail;
    result.slug = entity.slug;
    result.slug1 = entity.slug + entity.productId;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    return result;
  }

  public static fromProducts(entities: Partial<Product[]>) {
    const result: CreateProductTemplateDTO[] = [];
    for (const entity of entities) {
      const temp = new CreateProductTemplateDTO();
      temp.productName = entity.name;
      temp.productShortName = entity.slug;
      temp.thumbnail = entity.thumbnail;
      temp.slug = entity.slug;
      temp.slug1 = entity.slug + entity.productId;
      temp.createdAt = new Date();
      temp.updatedAt = new Date();
      result.push(temp);
    }
    return result;
  }
}

export class ProductTemplateResponse {
  @ApiProperty({ type: Number, example: 674 })
  productTemplateId: number;

  @ApiProperty({ type: String, example: 'Điện Thoại iPhone 13 128GB  - Hàng  Chính Hãng' })
  productName: string;

  @ApiProperty({
    type: String,
    example: 'https://salt.tikicdn.com/cache/200x200/ts/product/9e/44/ea/2b7ba151d4de1904beca5a66d383dad4.jpg',
  })
  thumbnail: string;

  @ApiProperty({ type: String, example: 'dien-thoai-iphone-13-128gb' })
  slug: string;

  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  updatedAt: Date;

  public static fromEntity(entity: Partial<PRODUCT_TEMPLATE>) {
    const result = new ProductTemplateResponse();
    result.productTemplateId = entity.productTemplateId;
    result.productName = entity.productName;
    result.thumbnail = entity.thumbnail;
    result.slug = entity.slug;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    return result;
  }

  public static fromEntities(entities: Partial<PRODUCT_TEMPLATE[]>) {
    const result: ProductTemplateResponse[] = [];
    for (const entity of entities) {
      const temp = new ProductTemplateResponse();
      temp.productTemplateId = entity.productTemplateId;
      temp.productName = entity.productName;
      temp.thumbnail = entity.thumbnail;
      temp.slug = entity.slug;
      temp.createdAt = entity.createdAt;
      temp.updatedAt = entity.updatedAt;
      result.push(temp);
    }
    return result;
  }
}

export class PagingProductTemplateResponse {
  @ApiProperty({ type: Number, example: 1 })
  total: number;

  @ApiProperty({ type: ProductTemplateResponse, isArray: true })
  data: ProductTemplateResponse[];

  public static from(total: number, data: PRODUCT_TEMPLATE[]) {
    const result = new PagingProductTemplateResponse();
    result.total = total;
    result.data = ProductTemplateResponse.fromEntities(data);
    return result;
  }
}

export class ProductTemplateDetailResponse {
  @ApiProperty({ type: Number, example: 674 })
  productTemplateId: number;

  @ApiProperty({ type: String, example: 'Điện Thoại iPhone 13 128GB  - Hàng  Chính Hãng' })
  productName: string;

  @ApiProperty({
    type: String,
    example: 'https://salt.tikicdn.com/cache/200x200/ts/product/9e/44/ea/2b7ba151d4de1904beca5a66d383dad4.jpg',
  })
  thumbnail: string;

  @ApiProperty({ type: String, example: 'dien-thoai-iphone-13-128gb' })
  slug: string;

  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  updatedAt: Date;

  @ApiProperty({ type: ProductResponse, isArray: true })
  items: ProductResponse[];

  public static fromEntity(entity: Partial<PRODUCT_TEMPLATE>) {
    const result = new ProductTemplateDetailResponse();
    result.productTemplateId = entity.productTemplateId;
    result.productName = entity.productName;
    result.thumbnail = entity.thumbnail;
    // result.price = entity.price;
    // result.average = entity.average;
    result.slug = entity.slug;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;

    result.items = entity?.productProducts?.map((product) => ProductResponse.fromEntity(product.product));
    return result;
  }
}

export class ProductTemplateQuery {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  search: string;

  @ApiProperty()
  categoryId: string;

  skip: number;

  public static from(dto: Partial<ProductTemplateQuery>) {
    const result = new ProductTemplateQuery();
    result.page = dto.page || 1;
    result.pageSize = dto.pageSize || 12;
    result.skip = (result.page - 1) * result.pageSize;
    result.search = dto.search;
    result.categoryId = dto.categoryId;
    return result;
  }
}

export class SaveProductTemplateParamDTO {
  @ApiProperty({ type: Number, example: 699 })
  productId: number;

  userId: number;

  public static from(dto: Partial<SaveProductTemplateParamDTO>) {
    const result = new SaveProductTemplateParamDTO();
    result.productId = dto.productId;
    result.userId = dto.userId;
    return result;
  }
}

export class CrawlProductQuery {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  search: string;

  @ApiProperty()
  merchant: string;

  skip: number;

  public static from(dto: Partial<CrawlProductQuery>) {
    const result = new CrawlProductQuery();
    result.page = dto.page || 1;
    result.pageSize = dto.pageSize || 12;
    result.skip = (result.page - 1) * result.pageSize;
    result.search = dto.search;
    result.merchant = dto.merchant;
    return result;
  }
}
