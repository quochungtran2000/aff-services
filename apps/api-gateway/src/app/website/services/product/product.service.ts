import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ProductService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${ProductService.name}`);
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

  getData() {
    this.logger.log(`${this.getData.name} called`);
    return { message: 'Welcome to Product' };
  }
}
