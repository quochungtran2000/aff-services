import { CATEGORY, CRAWL_CATEGORY } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({ type: String, example: 'Điện Thoại Di Động' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, example: 'ádsd', isArray: true })
  @IsNotEmpty()
  @IsArray({ message: 'mapCategory phải là một mảng chuỗi' })
  @IsString({ each: true, message: 'phần tử trong mapCategory phải là kiểu chuỗi' })
  mapCategory: string[];

  createdAt: Date;
  updatedAt: Date;

  public static from(dto: Partial<CreateCategoryDTO>) {
    const result = new CreateCategoryDTO();
    result.title = dto.title;
    result.mapCategory = dto.mapCategory;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    return result;
  }
}

export class UpdateCategoryDTO {
  @ApiProperty({ type: Number, example: 123 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ type: String, example: 'Điện thoại di động' })
  @IsString()
  title: string;

  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean()
  crawl: boolean;

  // @ApiProperty({ type: Boolean, example: true })
  // @IsBoolean()
  // app: boolean;

  // @ApiProperty({ type: Boolean, example: false })
  // @IsBoolean()
  // website: boolean;

  public static from(dto: Partial<UpdateCategoryDTO>) {
    const result = new UpdateCategoryDTO();
    result.categoryId = dto.categoryId;
    result.title = dto.title;
    result.active = dto.active;
    result.crawl = dto.crawl;
    // result.app = dto.app;
    // result.website = dto.website;
    return result;
  }
}

export class CategoryChildrenResponse {
  @ApiProperty({ type: String, example: '123' })
  crawlCategoryId: string;

  @ApiProperty({ type: String, example: 'tiki' })
  merchant: string;

  @ApiProperty({ type: String, example: 'Điện thoại' })
  title: string;

  @ApiProperty({ type: String, example: '/123' })
  slug: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;

  @ApiProperty({ type: Boolean, example: true })
  crawl: boolean;

  public static fromEntity(entity: Partial<CRAWL_CATEGORY>) {
    const result = new CategoryChildrenResponse();
    result.crawlCategoryId = entity.crawlCategoryId;
    result.merchant = entity.merchant;
    result.title = entity.title;
    result.slug = entity.slug;
    result.active = entity.active;
    result.crawl = entity.crawl;
    return result;
  }

  public static fromEntities(entities: Partial<CRAWL_CATEGORY[]>) {
    const result: CategoryChildrenResponse[] = [];
    for (const entity of entities) {
      const temp = new CategoryChildrenResponse();
      temp.crawlCategoryId = entity.crawlCategoryId;
      temp.merchant = entity.merchant;
      temp.title = entity.title;
      temp.slug = entity.slug;
      temp.active = entity.active;
      temp.crawl = entity.crawl;
      result.push(temp);
    }
    return result;
  }
}

export class CategoryResponse {
  @ApiProperty({ type: Number, example: 123 })
  categoryId: number;

  @ApiProperty({ type: String, example: 'Điện Thoại Di Động' })
  title: string;

  // @ApiProperty({ type: String, example: 'Điện Thoại Di Động' })
  // slug: string;

  @ApiProperty({ type: Boolean, example: true })
  active: boolean;

  @ApiProperty({ type: Boolean, example: true })
  crawl: boolean;

  @ApiProperty({ type: CategoryChildrenResponse, isArray: true })
  childrens: CategoryChildrenResponse[];

  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  updatedAt: Date;

  public static fromEntity(entity: Partial<CATEGORY>) {
    const result = new CategoryResponse();
    result.categoryId = entity.categoryId;
    result.title = entity.title;
    // result.slug = entity.slug;
    result.active = entity.active;
    result.crawl = entity.crawl;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    result.childrens =
      (entity.mappingCategory &&
        entity.mappingCategory.map((elm) => CategoryChildrenResponse.fromEntity(elm.crawlCategory))) ||
      [];
    return result;
  }

  public static fromEntities(entities: Partial<CATEGORY[]>) {
    const result: CategoryResponse[] = [];
    for (const entity of entities) {
      const temp = new CategoryResponse();
      temp.categoryId = entity.categoryId;
      temp.title = entity.title;
      // temp.slug = entity.slug;
      temp.active = entity.active;
      temp.crawl = entity.crawl;
      temp.createdAt = entity.createdAt;
      temp.updatedAt = entity.updatedAt;
      temp.childrens =
        (entity.mappingCategory &&
          entity.mappingCategory.map((elm) => CategoryChildrenResponse.fromEntity(elm.crawlCategory))) ||
        [];
      result.push(temp);
    }

    return result;
  }
}
