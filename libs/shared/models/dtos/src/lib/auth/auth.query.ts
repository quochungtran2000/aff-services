import { IsOptional, IsString } from 'class-validator';

export class RequestResetPasswordQuery {
  @IsOptional()
  @IsString()
  token: string;

  public static from(dto: Partial<RequestResetPasswordQuery>) {
    const result = new RequestResetPasswordQuery();
    result.token = dto.token;
    return result;
  }
}
