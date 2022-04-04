import { USER } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsNotEmpty } from 'class-validator';

export class LoginPayload {
  @ApiProperty({ type: String, example: 'hung' })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'ádasd' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String, example: 'hung' })
  @IsNotEmpty()
  password: string;

  public static from(dto: Partial<LoginPayload>) {
    const data = new LoginPayload();
    data.username = dto.username;
    data.password = dto.password;
    return data;
  }
}

export class LoginResponse {
  @ApiProperty({ type: String, example: 'Access Token' })
  token: string;
}

export class MyProfileResponse {
  @ApiProperty({ type: String, example: 1708 })
  userId: number;

  @ApiProperty({ type: String, example: 'hung' })
  username: string;

  @ApiProperty({ type: String, example: 'hung' })
  fullname: string;

  @ApiProperty({ type: String, example: 'hung@gmail.com' })
  email: string;

  @ApiProperty({ type: String, example: '091827781' })
  phoneNumber: string;

  @ApiProperty({ type: String, example: 'user' })
  role: string;

  public static fromEntity(entity: Partial<USER>) {
    const result = new MyProfileResponse();
    result.userId = entity.userId;
    result.username = entity.username;
    result.fullname = entity.fullname;
    result.email = entity.email;
    result.phoneNumber = entity.phoneNumber;
    result.role = entity.role.roleName || 'user';
    return result;
  }
}

export class RegisterPayload {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'tên đăng nhập không được để trống' })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'tên đăng nhập không được chưa khoảng trắng' })
  username: string;

  @ApiProperty({ type: String, required: true })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'mật khẩu không được chưa khoảng trắng' })
  @IsNotEmpty({ message: 'mật khẩu không được để trống' })
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'họ và tên không được để trống' })
  fullname: string;

  @ApiProperty({ type: String, required: true })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'username không được chưa khoảng trắng' })
  @IsNotEmpty({ message: 'email không được để trống' })
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'số điện thoại không được để trống' })
  @Matches(/[0][0-9]{8}/, { message: 'số điện thoại không đúng định dạng' })
  phoneNumber: string;

  // @ApiProperty({ type: String, required: true })
  // @IsNotEmpty()
  // @IsString()
  roleId: number;

  public static from(dto: Partial<RegisterPayload>) {
    const payload = new RegisterPayload();
    payload.username = dto.username;
    payload.password = dto.password;
    payload.fullname = dto.fullname;
    payload.email = dto.email;
    payload.phoneNumber = dto.phoneNumber;
    payload.roleId = dto.roleId;
    return payload;
  }
}

export class ChangePasswordPayload {
  @ApiProperty({ type: String, required: true })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'mật khẩu cũ không được chưa khoảng trắng' })
  @IsNotEmpty({ message: 'mật khẩu cũ không được để trống' })
  oldPassword: string;

  @ApiProperty({ type: String, required: true })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'mật khẩu mới không được chưa khoảng trắng' })
  @IsNotEmpty({ message: 'mật khẩu mới không được để trống' })
  newPassword: string;

  userId: number;

  public static from(dto: Partial<ChangePasswordPayload>) {
    const result = new ChangePasswordPayload();
    result.oldPassword = dto.oldPassword;
    result.newPassword = dto.newPassword;
    result.userId = dto.userId;
    return result;
  }
}
