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

const removeAccent = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  // Remove extra spaces
  str = str.replace(/\s{2,}/g, ' ');
  str = str.trim();
  // Remove punctuations
  // eslint-disable-next-line no-useless-escape
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  return str;
};
