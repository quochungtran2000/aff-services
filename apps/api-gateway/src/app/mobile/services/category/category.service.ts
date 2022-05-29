import { CategoryResponse } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserService } from '../user/user.service';

@Injectable()
export class CategoryService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${UserService.name}`);
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

  async mobileGetCategory() {
    this.logger.log(`${this.mobileGetCategory.name} called`);
    return await this.client
      .send<CategoryResponse[]>({ cmd: CMD.GET_APPLICATIONS_CATEGORY }, { application: 'mobile' })
      .toPromise();
  }
}
