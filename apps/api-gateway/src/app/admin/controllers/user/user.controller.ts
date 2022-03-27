import { Controller, Get, Logger } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';

@Controller('admin/user')
export class UserController {
  private readonly logger = new Logger(`Api-Gateway.${UserController.name}`);
  constructor(private readonly userService: UserService) {}

  @Get()
  async getData() {
    this.logger.log(`${this.getData.name} called`);
    return await this.userService.getData();
  }
}
