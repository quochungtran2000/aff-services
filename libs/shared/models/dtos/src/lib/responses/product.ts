import { Product } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  isSale: boolean;

  @ApiProperty()
  salePrice: number;

  @ApiProperty()
  discountPercent: number;

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
  productUrl: string;

  public static fromEntity(entity: Partial<Product>) {
    const result = new ProductResponse();
    result.productId = entity.productId;
    result.productName = entity.productName;
    result.productUrl = entity.productUrl;
    result.thumbnail = entity.thumbnail;
    result.isSale = entity.isSale;
    result.salePrice = entity.salePrice;
    result.discountPercent = entity.discountPercent;
    result.average = entity.average;
    result.sold = entity.sold;
    result.description = entity.description;
    result.merchant = entity.merchant;
    result.slug = entity.slug;
    return result;
  }

  public static fromEntities(entities: Partial<Product[]>) {
    const result: ProductResponse[] = [];
    for (const entity of entities) {
      const temp = new ProductResponse();
      temp.productId = entity.productId;
      temp.productName = entity.productName;
      temp.productUrl = entity.productUrl;
      temp.thumbnail = entity.thumbnail;
      temp.isSale = entity.isSale;
      temp.salePrice = entity.salePrice;
      temp.discountPercent = entity.discountPercent;
      temp.average = entity.average;
      temp.sold = entity.sold;
      temp.description = entity.description;
      temp.merchant = entity.merchant;
      temp.slug = entity.slug;
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