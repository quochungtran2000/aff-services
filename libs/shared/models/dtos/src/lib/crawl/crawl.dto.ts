import { ApiProperty } from '@nestjs/swagger';
import { IsIn, Matches } from 'class-validator';

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
