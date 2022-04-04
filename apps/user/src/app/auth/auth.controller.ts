import { ChangePasswordPayload, RegisterPayload } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(`Micro-User.${AuthController.name}`);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: CMD.LOGIN })
  login(data: { username: string; password: string }) {
    this.logger.log(`${this.login.name} called`);
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: CMD.MY_PROFILE })
  myProfile({ userId }: { userId: number }) {
    this.logger.log(`${this.login.name} called`);
    return this.authService.myProfile(userId);
  }

  @MessagePattern({ cmd: CMD.REGISTER })
  register(data: RegisterPayload) {
    this.logger.log(`${this.login.name} called`);
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: CMD.CHANGE_PASSWORD })
  changePassword(data: ChangePasswordPayload) {
    this.logger.log(`${this.changePassword.name} called`);
    return this.authService.changePassword(data);
  }
}
