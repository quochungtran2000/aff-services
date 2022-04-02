import { USER } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ type: Number, example: 2 })
  userId: number;

  @ApiProperty({ type: String, example: 'tranvana' })
  username: string;

  @ApiProperty({ type: String, example: 'Tran Van A' })
  fullname: string;

  @ApiProperty({ type: String, example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ type: String, example: '0123456789' })
  phoneNumber: string;

  @ApiProperty({ type: Number, example: 2 })
  roleId: number;

  @ApiProperty({ type: Date, example: Date.now() })
  createdAt: Date;

  @ApiProperty({ type: Date, example: Date.now() })
  updatedAt: Date;

  public static fromEntity(entity: Partial<USER>) {
    const result = new UserResponse();
    result.userId = entity.userId;
    result.username = entity.username;
    result.fullname = entity.fullname;
    result.email = entity.email;
    result.phoneNumber = entity.phoneNumber;
    result.roleId = entity.roleId;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    return result;
  }

  public static fromEntities(entities: Partial<USER[]>) {
    const result: UserResponse[] = [];
    for (const entity of entities) {
      const temp = new UserResponse();
      temp.userId = entity.userId;
      temp.username = entity.username;
      temp.fullname = entity.fullname;
      temp.email = entity.email;
      temp.phoneNumber = entity.phoneNumber;
      temp.roleId = entity.roleId;
      temp.createdAt = entity.createdAt;
      temp.updatedAt = entity.updatedAt;
      result.push(temp);
    }
    return result;
  }
}

export class PagingUserResponse {
  @ApiProperty({ type: Number, example: 1 })
  total: number;

  @ApiProperty({ type: UserResponse, isArray: true })
  data: UserResponse[];

  public static from(total: number, data: Partial<USER[]>) {
    const result = new PagingUserResponse();
    result.total = total;
    result.data = UserResponse.fromEntities(data);
    return result;
  }
}
