import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class UpdateRoleParam {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumberString()
  roleId: number;
}
