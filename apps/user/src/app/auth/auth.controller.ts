import { UserQueryDTO } from '@aff-services/shared/models/dtos';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(`Micro-User.${AuthController.name}`);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'find_user' })
  findUser(data: UserQueryDTO) {
    this.logger.log(`${this.findUser.name} called`);
    return this.authService.find(data);
  }

  @MessagePattern({ cmd: 'login' })
  login(data: { username: string; password: string }) {
    this.logger.log(`${this.login.name} called`);
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'my_profile' })
  myProfile({ userId }: { userId: number }) {
    this.logger.log(`${this.login.name} called`);
    return this.authService.myProfile(userId);
  }
}
