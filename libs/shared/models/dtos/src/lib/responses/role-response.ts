import { ROLE } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';

export class RoleResponse {
  @ApiProperty({ type: Number, example: 1 })
  roleId: number;

  @ApiProperty({ type: String, example: 'Login app' })
  roleName: string;

  @ApiProperty({ type: String, example: 'login_app' })
  slug: string;

  @ApiProperty({ type: String, example: 'Dùng để đăng nhập mobile application' })
  description: string;

  public static fromEntity(dto: Partial<ROLE>) {
    const response = new RoleResponse();
    response.roleId = dto.roleId;
    response.roleName = dto.roleName;
    response.slug = dto.slug;
    response.description = dto.description;
    return response;
  }

  public static fromEntities(dto: Partial<ROLE[]>) {
    const reuslt: RoleResponse[] = [];
    for (const elm of dto) {
      const response = new RoleResponse();
      response.roleId = elm.roleId;
      response.roleName = elm.roleName;
      response.slug = elm.slug;
      response.description = elm.description;
      reuslt.push(response);
    }
    return reuslt;
  }
}

export class PagingRoleResponse {
  @ApiProperty({ type: Number, example: 1 })
  total: number;

  @ApiProperty({ type: RoleResponse, isArray: true })
  data: RoleResponse[];

  public static from(total: number, data: Partial<ROLE[]>) {
    const result = new PagingRoleResponse();
    result.total = total;
    result.data = RoleResponse.fromEntities(data);

    return result;
  }
}
