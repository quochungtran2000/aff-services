import { PagingPermissionResponse } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  private readonly logger = new Logger(`Micro-User.${PermissionController.name}`);
  constructor(private readonly permissionSerivce: PermissionService) {}

  @MessagePattern({ cmd: CMD.ADMIN_GET_PERMISSION })
  getPermissions(): Promise<PagingPermissionResponse> {
    this.logger.log(`${this.getPermissions.name} called`);
    return this.permissionSerivce.getPermissions();
  }
}
