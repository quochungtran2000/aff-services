import { PagingPermissionResponse } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(`Api-Gateway.${PermissionService.name}`);
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
}
