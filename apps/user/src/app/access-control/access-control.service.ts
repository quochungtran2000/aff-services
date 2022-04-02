import { Injectable, Logger } from '@nestjs/common';
import { AccessControlRepo } from '../repositories/accessControlRepo';
import {
  BaseResponse,
  CreateRoleDTO,
  PagingPermissionResponse,
  PagingRoleResponse,
  UpdateRoleDTO,
} from '@aff-services/shared/models/dtos';

@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(`Micro-User.${AccessControlService.name}`);
  constructor(private readonly accessControlRepo: AccessControlRepo) {}

  async getPermissions(): Promise<PagingPermissionResponse> {
    this.logger.log(`${this.getPermissions.name} called`);
    return await this.accessControlRepo.getManyAndCountPermissions();
  }

  async getRoles(): Promise<PagingRoleResponse> {
    this.logger.log(`${this.getRoles.name} called`);
    return await this.accessControlRepo.getManyAndCountRoles();
  }

  async createRole(data: CreateRoleDTO): Promise<BaseResponse> {
    this.logger.log(`${this.createRole.name} called`);
    return await this.accessControlRepo.createRole(data);
  }

  async updateRole(data: UpdateRoleDTO): Promise<BaseResponse> {
    this.logger.log(`${this.updateRole.name} called`);
    return await this.accessControlRepo.updateRoleById(data);
  }
}
