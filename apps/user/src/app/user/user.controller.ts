import { UserQuery } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(`Micro-User.${UserController.name}`);
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: CMD.ADMIN_GET_USERS })
  adminGetUsers(query: UserQuery) {
    this.logger.log(`${this.adminGetUsers.name}`);
    return this.userService.adminGetUsers(query);
  }
}
