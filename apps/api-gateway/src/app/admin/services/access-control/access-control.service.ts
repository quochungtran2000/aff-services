import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import {
  BaseResponse,
  CreateRoleDTO,
  PagingPermissionResponse,
  PagingRoleResponse,
  UpdateRoleDTO,
} from '@aff-services/shared/models/dtos';

@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(`Api-Gateway.${AccessControlService.name}`);
  private readonly client: ClientProxy;
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

  async getPermissions() {
    this.logger.log(`${this.getPermissions.name} called`);
    return await this.client.send<PagingPermissionResponse>({ cmd: CMD.ADMIN_GET_PERMISSION }, {}).toPromise();
  }

  async getRoles() {
    this.logger.log(`${this.getPermissions.name} called`);
    return await this.client.send<PagingRoleResponse>({ cmd: CMD.ADMIN_GET_ROLES }, {}).toPromise();
  }

  async createRole(data: CreateRoleDTO) {
    this.logger.log(`${this.createRole.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.ADMIN_CREATE_ROLE }, data).toPromise();
  }

  async updateRole(data: UpdateRoleDTO) {
    this.logger.log(`${this.updateRole.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.ADMIN_UPDATE_ROLE }, data).toPromise();
  }
}
