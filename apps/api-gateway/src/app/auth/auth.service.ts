import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CMD } from '@aff-services/shared/utils/helpers';
import {
  BaseResponse,
  ChangePasswordPayload,
  CheckRequestResetPasswordResponse,
  ForgotPasswordPayload,
  LoginResponse,
  RegisterPayload,
  RequestResetPasswordQuery,
  ResetPasswordPayload,
} from '@aff-services/shared/models/dtos';

@Injectable()
export class AuthService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.Admin.${AuthService.name}`);
  constructor() {
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

  async login(data: { username: string; password: string }) {
    this.logger.log(`${this.login.name} called`);
    return await this.client.send<LoginResponse>({ cmd: CMD.LOGIN }, data).toPromise();
  }

  async register(data: RegisterPayload) {
    this.logger.log(`${this.register.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.REGISTER }, data).toPromise();
  }

  async changePassword(data: ChangePasswordPayload) {
    this.logger.log(`${this.changePassword.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.CHANGE_PASSWORD }, data).toPromise();
  }

  async forgotPassword(data: ForgotPasswordPayload) {
    this.logger.log(`${this.forgotPassword.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.FORGOT_PASSWORD }, data).toPromise();
  }

  async checkRequestResetPassword(data: RequestResetPasswordQuery) {
    this.logger.log(`${this.checkRequestResetPassword.name} called`);
    return await this.client
      .send<CheckRequestResetPasswordResponse>({ cmd: CMD.CHECK_REQUEST_RESET_PASSWORD }, data)
      .toPromise();
  }

  async resetPassword(data: ResetPasswordPayload) {
    this.logger.log(`${this.resetPassword.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.RESET_PASSWORD }, data).toPromise();
  }
}
