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

  async getProducts() {
    this.logger.log(`${this.getProducts.name} called`);
    return await this.client.send({ cmd: CMD.ADMIN_GET_PRODUCTS }, {}).toPromise();
  }

  async websiteGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.websiteGetProducts.name} called`);
    return await this.client.send({ cmd: CMD.WEBSITE_GET_PRODUCTS }, data).toPromise();
  }

  async websiteGetProduct(id: number) {
    this.logger.log(`${this.websiteGetProducts.name} called`);
    return await this.client.send({ cmd: CMD.WEBSITE_GET_PRODUCT }, { id }).toPromise();
  }
}
