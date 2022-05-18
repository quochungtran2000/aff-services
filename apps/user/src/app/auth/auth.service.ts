import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { AccessControlRepo } from '../repositories/accessControlRepo';
import { UserRepo } from '../repositories/userRepo';
import { BcryptService } from '@aff-services/shared/common/services';
import {
  BaseResponse,
  ChangePasswordPayload,
  CheckRequestResetPasswordResponse,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MyProfileResponse,
  RegisterPayload,
  RequestResetPasswordQuery,
  ResetPasswordPayload,
} from '@aff-services/shared/models/dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`Micro-User.${AuthService.name}`);
  private readonly bcryptService = new BcryptService();

  constructor(
    private readonly userRepo: UserRepo,
    private jwtService: JwtService,
    private readonly accessControlRepo: AccessControlRepo
  ) {}

  async login({ username, password }: LoginPayload): Promise<LoginResponse> {
    try {
      this.logger.log(`${this.login.name} called`);
      const exists = await this.userRepo.findUserLogin(username);
      if (!exists) throw new BadRequestException('username hoặc password không chính xác!.');
      const { password: hashPassword, ...user } = exists;

      const matchPassword = await this.bcryptService.comparePassword(password, hashPassword);

      if (!matchPassword) throw new BadRequestException('username hoặc password không chính xác!.');

      const token = this.jwtService.sign({
        userId: user.userId,
        ...user,
      });

      return { token, user: MyProfileResponse.fromEntity(user) };
    } catch (error) {
      this.logger.error(`${this.login.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async myProfile(userId: number): Promise<MyProfileResponse> {
    try {
      this.logger.log(`${this.myProfile.name} called`);
      const user = await this.userRepo.getProfileByUserId(userId);
      return MyProfileResponse.fromEntity(user);
    } catch (error) {
      this.logger.error(`${this.myProfile.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async register(data: RegisterPayload): Promise<BaseResponse> {
    try {
      this.logger.log(`${this.register.name} called`);
      const userRole = await this.accessControlRepo.findOneRoleBySlug('user');
      data['roleId'] = userRole.roleId;
      await this.userRepo.createUser(data);
      return { status: 201, message: 'create user success' };
    } catch (error) {
      this.logger.error(`${this.register.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async changePassword({ userId, oldPassword, newPassword }: ChangePasswordPayload): Promise<BaseResponse> {
    try {
      this.logger.log(`${this.changePassword.name} called`);
      const { password } = await this.userRepo.findOneByUserId(userId);

      const matchPassword = await this.bcryptService.comparePassword(oldPassword, password);
      if (!matchPassword)
        throw new BadRequestException('Tên đăng nhập hoặc mật khẩu không đúng. Xin vui lòng thử lại!');

      const hashPassword = await this.bcryptService.hashPassword(newPassword);

      await this.userRepo.findOneByUserIdAndUpdatePassword(userId, hashPassword);

      return { status: 200, message: 'Đổi mật khẩu thành công' };
    } catch (error) {
      this.logger.error(`${this.changePassword.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async forgotPassword({ username }: ForgotPasswordPayload) {
    try {
      this.logger.log(`${this.forgotPassword.name} called`);
      const { email, userId } = await this.userRepo.findUserLogin(username);
      if (!email) throw new BadRequestException('Không tìm thấy người dùng');
      const hashUserId = await this.bcryptService.hashPassword(userId + '');
      const code = `${userId}@.${hashUserId}`;
      const urlPath = await this.jwtService.sign({ userId, code });
      return { urlPath };
    } catch (error) {
      this.logger.error(`${this.forgotPassword.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async checkRequestResetPassword({ token }: RequestResetPasswordQuery): Promise<CheckRequestResetPasswordResponse> {
    try {
      this.logger.log(`${this.checkRequestResetPassword.name} called`);
      try {
        const { userId, code } = await this.jwtService.verifyAsync(token);
        const [id, hashUserId] = code.split('@.');
        const isMatch = await this.bcryptService.comparePassword(id, hashUserId);
        if (id == userId && isMatch) return { valid: true };
        else {
          return { valid: false, message: 'Đường dẫn không chính xác' };
        }
      } catch (error) {
        return { valid: false, message: 'Đường dẫn đã hết hạn' };
      }
    } catch (error) {
      this.logger.error(`${this.checkRequestResetPassword.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async resetPassword({ token, password, confirmPassword }: ResetPasswordPayload): Promise<BaseResponse> {
    try {
      let valid: boolean;
      let userIden: number;
      this.logger.log(`${this.resetPassword.name} called`);
      try {
        const { userId, code } = await this.jwtService.verifyAsync(token);
        userIden = userId;
        const [id, hashUserId] = code.split('@.');
        const isMatch = await this.bcryptService.comparePassword(id, hashUserId);
        if (id == userId && isMatch) valid = true;
      } catch (error) {
        valid = false;
      }

      if (!valid) throw new BadRequestException('Đường dẫn không đúng hoặc đã hết hạn');
      if (password !== confirmPassword) throw new BadRequestException('Mat khau khong giong nhau');
      const hashPassword = await this.bcryptService.hashPassword(password);

      // update user password
      await this.userRepo.findOneByUserIdAndUpdatePassword(userIden, hashPassword);

      return { status: 200, message: 'Cập nhật mật khẩu thành công' };
    } catch (error) {
      this.logger.error(`${this.resetPassword.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }
}
