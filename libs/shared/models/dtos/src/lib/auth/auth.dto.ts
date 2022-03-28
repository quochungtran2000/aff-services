import { USER } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Matches, IsNotEmpty, IsString } from 'class-validator';

export class LoginPayload {
  @ApiProperty({ type: String, example: 'hung' })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'ádasd' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String, example: 'hung' })
  @IsNotEmpty()
  password: string;
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
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'username không được chưa khoảng trắng' })
  username: string;

  @ApiProperty({ type: String, required: true })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'username không được chưa khoảng trắng' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ type: String, required: true })
  @Matches(/^[a-zA-Z0-9@.]+$/, { message: 'username không được chưa khoảng trắng' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @Matches(/[0-9]{9}/)
  @IsString()
  phoneNumber: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  role: string;

  public static from(dto: Partial<RegisterPayload>) {
    const payload = new RegisterPayload();
    payload.username = dto.username;
    payload.password = dto.password;
    payload.fullname = dto.fullname;
    payload.email = dto.email;
    payload.phoneNumber = dto.phoneNumber;
    payload.role = dto.role;
    return payload;
  }
}
