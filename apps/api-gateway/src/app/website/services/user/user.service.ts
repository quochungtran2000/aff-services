import { ProductCommentResponseDTO } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class UserService {
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

  async getSaveProducts(userId: number) {
    this.logger.log(`${this.getSaveProducts.name} called userId:${userId}`);
    return await this.client.send<ProductCommentResponseDTO[]>({ cmd: CMD.GET_SAVE_PRODUCT }, { userId }).toPromise();
  }
}
