import { ConfigPayload, UpdateUserDTO, UserQuery } from '@aff-services/shared/models/dtos';
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

  @MessagePattern({ cmd: CMD.UPLOAD_FILE })
  uploadFile({ file }: any) {
    this.logger.log(`${this.uploadFile.name} called`);
    return this.userService.uploadFile(file);
  }

  @MessagePattern({ cmd: CMD.UPDATE_USER })
  updateUser(data: UpdateUserDTO) {
    this.logger.log(`${this.updateUser.name} called`);
    return this.userService.updateUser(data);
  }

  @MessagePattern({ cmd: CMD.ADMIN_GET_CONFIG })
  getConfigs() {
    this.logger.log(`${this.getConfigs.name} called`);
    return this.userService.getConfigs();
  }

  @MessagePattern({ cmd: CMD.ADMIN_CREATE_CONFIG })
  createConfig(data: ConfigPayload) {
    this.logger.log(`${this.createConfig.name} called`);
    return this.userService.createConfig(data);
  }

  @MessagePattern({ cmd: CMD.ADMIN_UPDATE_CONFIG })
  updateConfig(data: ConfigPayload) {
    this.logger.log(`${this.updateConfig.name} called`);
    return this.userService.updateConfig(data);
  }

  @MessagePattern({ cmd: CMD.ADMIN_DELETE_CONFIG })
  deleteConfig({ configName }: { configName: string }) {
    this.logger.log(`${this.deleteConfig.name} called`);
    return this.userService.deleteConfig(configName);
  }

  @MessagePattern({ cmd: CMD.ADMIN_GET_FINACE_REPORT })
  adminGetFinanceReport() {
    this.logger.log(`${this.adminGetFinanceReport.name} called`);
    return this.userService.adminGetFinanceReport();
  }
}
