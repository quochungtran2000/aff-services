import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(`Micro-User.${AuthController.name}`);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'find_user' })
  findUser(data: any) {
    this.logger.log(`${this.findUser.name} called`);
    return this.authService.find(data);
  }
}
