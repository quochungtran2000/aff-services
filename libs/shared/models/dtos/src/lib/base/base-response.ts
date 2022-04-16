import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({ type: Number, example: 200 })
  status: number;

  @ApiProperty({ type: String, example: 'example message' })
  message: string;
}
