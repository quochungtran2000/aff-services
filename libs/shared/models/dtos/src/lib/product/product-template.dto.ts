import { Product, PRODUCT_TEMPLATE } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ProductResponse } from './product-response.dto';

export class CreateProductTemplateDTO {
  productName: string;
  thumbnail: string;
  price: number;
  average: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;

  public static fromProduct(entity: Partial<Product>) {
    const result = new CreateProductTemplateDTO();
    result.productName = entity.productName;
    result.thumbnail = entity.thumbnail;
    result.price = entity.salePrice;
    result.average = entity.average;
    result.slug = entity.slug;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    result.productId = entity.productId;
    return result;
  }

  public static fromProducts(entities: Partial<Product[]>) {
    const result: CreateProductTemplateDTO[] = [];
    for (const entity of entities) {
      const temp = new CreateProductTemplateDTO();
      temp.productName = entity.productName;
      temp.thumbnail = entity.thumbnail;
      temp.price = entity.salePrice;
      temp.average = entity.average;
      temp.slug = entity.slug;
      temp.createdAt = new Date();
      temp.updatedAt = new Date();
      temp.productId = entity.productId;
      result.push(temp);
    }
    return result;
  }
}

export class ProductTemplateResponse {
  @ApiProperty()
  productTemplateId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  average: number;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  public static fromEntity(entity: Partial<PRODUCT_TEMPLATE>) {
    const result = new ProductTemplateResponse();
    result.productTemplateId = entity.productTemplateId;
    result.productName = entity.productName;
    result.thumbnail = entity.thumbnail;
    result.price = entity.price;
    result.average = entity.average;
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
      temp.price = entity.price;
      temp.average = entity.average;
      temp.slug = entity.slug;
      temp.createdAt = entity.createdAt;
      temp.updatedAt = entity.updatedAt;
      result.push(temp);
    }
    return result;
  }
}

export class PagingProductTemplateResponse {
  @ApiProperty()
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
  @ApiProperty()
  productTemplateId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  average: number;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: ProductResponse, isArray: true })
  products: ProductResponse[];

  public static fromEntity(entity: Partial<PRODUCT_TEMPLATE>) {
    const result = new ProductTemplateDetailResponse();
    result.productTemplateId = entity.productTemplateId;
    result.productName = entity.productName;
    result.thumbnail = entity.thumbnail;
    result.price = entity.price;
    result.average = entity.average;
    result.slug = entity.slug;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    const products = [];
    entity.productProducts?.map((product) => products.push(ProductResponse.fromEntity(product.product)));
    result.products = products;
    return result;
  }
}

export class ProductTemplateQuery {
  @ApiProperty()
  page: number;

  @ApiProperty()
  page_size: number;

  @ApiProperty()
  search: string;

  skip: number;

  public static from(dto: Partial<ProductTemplateQuery>) {
    const result = new ProductTemplateQuery();
    result.page = dto.page || 1;
    result.page_size = dto.page_size || 12;
    result.skip = (result.page - 1) * result.page_size;
    result.search = dto.search;
    return result;
  }
}
