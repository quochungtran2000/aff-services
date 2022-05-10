import { removeAccent } from '@aff-services/shared/utils/helpers';
export class CreateProductDTO {
  productId: string;
  productName: string;
  thumbnail: string;
  isSale: boolean;
  salePrice: number;
  discountPercent: number;
  average: number;
  sold: number;
  description: string;
  merchant: string;
  slug: string;
  productUrl: string;
  createdAt: Date;
  updatedAt: Date;

  public static from(dto: Partial<CreateProductDTO>) {
    const result = new CreateProductDTO();
    result.productId = dto.productId;
    result.productName = dto.productName;
    result.productUrl = dto.productUrl;
    result.thumbnail = dto.thumbnail;
    result.isSale = dto.isSale;
    result.salePrice = dto.salePrice;
    result.discountPercent = dto.discountPercent;
    result.average = dto.average;
    result.sold = dto.sold;
    result.description = dto.description;
    result.merchant = dto.merchant;
    result.slug = getProductSlug(dto.productName);
    result.createdAt = new Date();
    result.updatedAt = new Date();
    return result;
  }

  public static fromArray(dtos: Partial<CreateProductDTO[]>) {
    const result: CreateProductDTO[] = [];
    for (const dto of dtos) {
      const temp = new CreateProductDTO();
      temp.productId = dto.productId;
      let productName;
      dto.productName.startsWith('[') ? (productName = dto.productName.split(']')[1]) : (productName = dto.productName);
      productName = productName
        .split('-')
        .shift()
        .split('|')
        .shift()
        .split(',')
        .shift()
        .split('(')
        .shift()
        .split('[')
        .shift()
        .trim();
      temp.productName = productName;
      temp.productUrl = dto.productUrl;
      temp.thumbnail = dto.thumbnail;
      temp.isSale = dto.isSale;
      temp.salePrice = Math.round(dto.salePrice);
      temp.discountPercent = Math.round(dto.discountPercent);
      temp.average = Math.round(dto.average);
      temp.sold = Math.round(dto.sold);
      temp.description = dto.description;
      temp.merchant = dto.merchant;
      temp.slug = getProductSlug(productName);
      temp.createdAt = new Date();
      temp.updatedAt = new Date();
      result.push(temp);
    }
    return result;
  }
}

const getProductSlug = (productName: string) => {
  let name = productName.split('-')[0].split('(')[0].trim();
  name = removeAccent(name);
  name = name
    ?.toLocaleLowerCase()
    .split(' ')
    .join('-')
    .replace(/(------|-----|----|---|--)/g, '-');
  return name;
};
