import { ProductTemplateQuery } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
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

  async mobileGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.mobileGetProducts.name} called`);
    return await this.client.send({ cmd: CMD.MOBILE_GET_PRODUCTS }, data).toPromise();
  }

  async mobileGetProduct(id: number) {
    this.logger.log(`${this.mobileGetProducts.name} called`);
    return await this.client.send({ cmd: CMD.MOBILE_GET_PRODUCT }, { id }).toPromise();
  }
}
