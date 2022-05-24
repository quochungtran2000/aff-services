import { removeAccent } from '@aff-services/shared/utils/helpers';
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
