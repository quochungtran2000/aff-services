import { MyProfileResponse, UserQueryDTO } from '@aff-services/shared/models/dtos';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UserRepo } from '../repositories/userRepo';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`Micro-User.${AuthService.name}`);

  constructor(private readonly userRepo: UserRepo, private jwtService: JwtService) {}

  async find(query: UserQueryDTO) {
    this.logger.log(`${this.find.name} Query:${JSON.stringify(query)}`);
    return await this.userRepo.find(query);
  }

  async login({ username, password }: { username: string; password: string }) {
    try {
      this.logger.log(`${this.login.name} called`);
      const user = await this.userRepo.findUserLogin(username);
      if (!user) throw new BadRequestException('username hoặc password không chính xác!.');

      if (password !== user.password) throw new BadRequestException('username hoặc password không chính xác!.');

      const token = this.jwtService.sign({
        userId: user.userId,
      });

      return { token };
    } catch (error) {
      this.logger.error(`${this.login.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async myProfile(userId: number) {
    try {
      this.logger.log(`${this.myProfile.name} called`);
      const user = await this.userRepo.getProfileByUserId(userId);
      return MyProfileResponse.fromEntity(user);
    } catch (error) {
      this.logger.error(`${this.myProfile.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }
}
