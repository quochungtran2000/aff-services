import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { UpdateRoleParam } from '../params/role.param';

export class CreateRoleDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'example', required: true })
  roleName: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'example', required: true })
  @Matches(/^[a-z_]+$/)
  slug: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'example', required: false })
  description: string;

  public static from(dto: Partial<CreateRoleDTO>) {
    const result = new CreateRoleDTO();
    result.roleName = dto.roleName;
    result.slug = dto.slug;
    result.description = dto.description;
    return result;
  }
}

export class UpdateRoleDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'example', required: true })
  roleName: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'example', required: true })
  @Matches(/^[a-z_]+$/)
  slug: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'example', required: false })
  description: string;

  roleId: number;

  public static from(params: Partial<UpdateRoleParam>, data: UpdateRoleDTO) {
    const result = new UpdateRoleDTO();
    result.roleId = params.roleId;
    result.roleName = data.roleName;
    result.slug = data.slug;
    result.description = data.description;
    return result;
  }
}
