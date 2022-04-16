import { PERMISSION } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponse {
  @ApiProperty({ type: Number, example: 1 })
  permissionId: number;

  @ApiProperty({ type: String, example: 'Login app' })
  permissionName: string;

  @ApiProperty({ type: String, example: 'login_app' })
  slug: string;

  @ApiProperty({ type: String, example: 'Dùng để đăng nhập mobile application' })
  description: string;

  public static fromEntity(dto: Partial<PERMISSION>) {
    const response = new PermissionResponse();
    response.permissionId = dto.permissionId;
    response.permissionName = dto.permissionName;
    response.slug = dto.slug;
    response.description = dto.description;
    return response;
  }

  public static fromEntities(dto: Partial<PERMISSION[]>) {
    const reuslt: PermissionResponse[] = [];
    for (const elm of dto) {
      const response = new PermissionResponse();
      response.permissionId = elm.permissionId;
      response.permissionName = elm.permissionName;
      response.slug = elm.slug;
      response.description = elm.description;
      reuslt.push(response);
    }
    return reuslt;
  }
}

export class PagingPermissionResponse {
  @ApiProperty({ type: Number, example: 1 })
  total: number;

  @ApiProperty({ type: PermissionResponse, isArray: true })
  data: PermissionResponse[];

  public static from(total: number, data: Partial<PERMISSION[]>) {
    const result = new PagingPermissionResponse();
    result.total = total;
    result.data = PermissionResponse.fromEntities(data);

    return result;
  }
}
