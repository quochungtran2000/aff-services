import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';

export class CrawlPayload {
  @ApiProperty()
  @Matches(/https?:\/\/(tiki.vn|shopee.vn|www.lazada.vn)/)
  url: string;

  // @ApiProperty()
  // @IsIn(['smartphone', 'monitor'])
  // category: 'smartphone';

  public static from(dto: Partial<CrawlPayload>) {
    const result = new CrawlPayload();
    // result.category = dto.category;
    result.url = dto.url;
    return result;
  }
}

export class GetCrawlProductHistoryQuery {
  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  page?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  pageSize?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: number;

  skip?: number;

  id: number;

  public static from(dto: Partial<GetCrawlProductHistoryQuery>) {
    const result = new GetCrawlProductHistoryQuery();
    result.page = dto.page || 1;
    result.pageSize = dto.pageSize || 10;
    result.skip = (result.page - 1) * result.pageSize;
    result.search = dto.search;
    result.id = dto.id;
    return result;
  }
}
