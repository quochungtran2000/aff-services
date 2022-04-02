import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccessControlService } from './access-control.service';
import {
  AssignPermissionDTO,
  BaseResponse,
  CreateRoleDTO,
  PagingPermissionResponse,
  PagingRoleResponse,
  UpdateRoleDTO,
} from '@aff-services/shared/models/dtos';

@Controller('access-control')
export class AccessControlController {
  private readonly logger = new Logger(`Micro-User.${AccessControlController.name}`);
  constructor(private readonly accessControlService: AccessControlService) {}

  @MessagePattern({ cmd: CMD.ADMIN_GET_PERMISSION })
  getPermissions(): Promise<PagingPermissionResponse> {
    this.logger.log(`${this.getPermissions.name} called`);
    return this.accessControlService.getPermissions();
  }

  @MessagePattern({ cmd: CMD.ADMIN_GET_ROLES })
  getRoles(): Promise<PagingRoleResponse> {
    this.logger.log(`${this.getRoles.name} called`);
    return this.accessControlService.getRoles();
  }

  @MessagePattern({ cmd: CMD.ADMIN_CREATE_ROLE })
  createRole(data: CreateRoleDTO): Promise<BaseResponse> {
    this.logger.log(`${this.createRole.name} called`);
    return this.accessControlService.createRole(data);
  }

  @MessagePattern({ cmd: CMD.ADMIN_UPDATE_ROLE })
  updateRole(data: UpdateRoleDTO): Promise<BaseResponse> {
    this.logger.log(`${this.updateRole.name} called`);
    return this.accessControlService.updateRole(data);
  }

  @MessagePattern({ cmd: CMD.ADMIN_ASSIGNN_PERMISSON })
  assignPermission(data: AssignPermissionDTO): Promise<BaseResponse> {
    this.logger.log(`${this.assignPermission.name} called`);
    return this.accessControlService.assignPermission(data);
  }
}
