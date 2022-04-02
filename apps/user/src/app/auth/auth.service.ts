import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { AccessControlRepo } from '../repositories/accessControlRepo';
import { UserRepo } from '../repositories/userRepo';
import { BcryptService } from '@aff-services/shared/common/services';
import {
  BaseResponse,
  LoginPayload,
  LoginResponse,
  MyProfileResponse,
  RegisterPayload,
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
      const { password: hashPassword, ...user } = await this.userRepo.findUserLogin(username);
      if (!user) throw new BadRequestException('username hoặc password không chính xác!.');

      const matchPassword = await this.bcryptService.comparePassword(password, hashPassword);

      if (!matchPassword) throw new BadRequestException('username hoặc password không chính xác!.');

      const token = this.jwtService.sign({
        userId: user.userId,
        ...user,
      });

      return { token };
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
}
