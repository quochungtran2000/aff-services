import { ROLE, USER } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches } from 'class-validator';
import { RoleResponse } from '../access-control';

// export class RoleResponse {
//   @ApiProperty({ type: Number, example: 2 })
//   roleId: number;

//   @ApiProperty({ type: String, example: 'User' })
//   roleName: string;

//   @ApiProperty({ type: String, example: 'role description' })
//   description: string;

//   @ApiProperty({ type: String, example: 'slug' })
//   slug: string;

//   public static fromEntity(entity: Partial<ROLE>) {
//     const result = new RoleResponse();
//     result.roleId = entity.roleId;
//     result.roleName = entity.roleName;
//     result.description = entity.description;
//     result.slug = entity.slug;
//     return result;
//   }
// }

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

  @ApiProperty({ type: String, example: 'hung@gmail.com' })
  imgUrl: string;

  @ApiProperty({ type: RoleResponse, required: false })
  role?: RoleResponse;

  public static fromEntity(entity: Partial<USER>) {
    const result = new UserResponse();
    result.userId = entity.userId;
    result.username = entity.username;
    result.fullname = entity.fullname;
    result.email = entity.email;
    result.imgUrl = entity.imgUrl;
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
      temp.imgUrl = entity.imgUrl;
      temp.phoneNumber = entity.phoneNumber;
      temp.roleId = entity.roleId;
      temp.createdAt = entity.createdAt;
      temp.updatedAt = entity.updatedAt;
      result.push(temp);
    }
    return result;
  }

  public static haveRole(entity: Partial<USER>) {
    const result = new UserResponse();
    result.userId = entity.userId;
    result.username = entity.username;
    result.fullname = entity.fullname;
    result.email = entity.email;
    result.imgUrl = entity.imgUrl;
    result.phoneNumber = entity.phoneNumber;
    result.roleId = entity.roleId;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    result.role = RoleResponse.fromEntity(entity.role);
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

export class UpdateUserDTO {
  @IsOptional()
  @ApiProperty({ type: String, example: 'Trần Quốc Hùng' })
  fullname: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'tranhung@gmail.com' })
  @Matches(/^[a-zA-Z0-9@._]+$/, { message: 'vui lòng nhập email đúng định dạng' })
  @IsEmail({}, { message: 'email phải đúng định dạng' })
  email: string;

  @IsOptional()
  @ApiProperty({ type: String, example: '0918266809' })
  @Matches(/[0][0-9]{9}/, { message: 'vui lòng nhập số điện thoại đúng định dạng' })
  phoneNumber: string;

  @IsOptional()
  @ApiProperty({ type: String, example: '' })
  imgUrl: string;

  userId: number;

  public static from(dto: Partial<UpdateUserDTO>) {
    const result = new UpdateUserDTO();
    result.fullname = dto.fullname;
    result.email = dto.email;
    result.phoneNumber = dto.phoneNumber;
    result.imgUrl = dto.imgUrl;
    result.userId = dto.userId;
    return result;
  }
}
