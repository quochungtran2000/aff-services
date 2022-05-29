import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class CommentService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${CommentService.name}`);
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

  async getEcommerceProductComment(productId: string) {
    this.logger.log(`${this.getEcommerceProductComment.name} called`);
    return this.client.send<any>({ cmd: CMD.GET_ECOMMERCE_COMMENT }, { productId }).toPromise();
  }
}
