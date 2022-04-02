import { BaseResponse, LoginResponse, RegisterPayload } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.Admin.${AuthService.name}`);
  constructor(private jwtService: JwtService) {
    this.logger.log(`Connecting to: ${process.env.REDIS_URL}`);
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL,
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return null;
  }

  async login(data: { username: string; password: string }) {
    this.logger.log(`${this.login.name} called`);
    return await this.client.send<LoginResponse>({ cmd: 'login' }, data).toPromise();
  }

  async register(data: RegisterPayload) {
    this.logger.log(`${this.register.name} called`);
    return await this.client.send<BaseResponse>({ cmd: 'register' }, data).toPromise();
  }
}
