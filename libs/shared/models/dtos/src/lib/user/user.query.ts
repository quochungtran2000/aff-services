import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class UserQuery {
  @IsOptional()
  @ApiProperty({ type: Number, example: 1, required: false })
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ type: Number, example: 12, required: false })
  pageSize: number;

  @IsOptional()
  @ApiProperty({ type: String, example: 'search example', required: false })
  search: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'tranvana', required: false })
  username: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'Tran Van A', required: false })
  fullname: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'example@gmail.com', required: false })
  email: string;

  @IsOptional()
  @ApiProperty({ type: String, example: '0123456789', required: false })
  phoneNumber: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'id', required: false })
  column: string;

  @IsOptional()
  @IsIn(['DESC', 'ASC'])
  @ApiProperty({ type: String, example: 'DESC', required: false })
  sort: 'DESC' | 'ASC';

  public static from(dto: Partial<UserQuery>) {
    const result = new UserQuery();
    result.page = Number(dto.page) || 1;
    result.pageSize = Number(dto.pageSize) || 12;
    result.search = dto.search;
    result.username = dto.username;
    result.fullname = dto.fullname;
    result.email = dto.email;
    result.phoneNumber = dto.phoneNumber;
    result.column = dto.column || 'created_at';
    result.sort = dto.sort || 'DESC';
    return result;
  }
}
