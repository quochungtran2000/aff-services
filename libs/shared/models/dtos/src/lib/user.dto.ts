import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class UserQueryDTO {
  @ApiProperty({ type: String, example: 'hung' })
  username: string;

  @ApiProperty({ type: String, example: 'asdas' })
  password: string;

  public static from(dto: Partial<UserQueryDTO>) {
    const query = new UserQueryDTO();
    query.username = dto.username;
    query.password = dto.password;
    return query;
  }
}
