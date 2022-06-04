import { CrawlProductQuery, ProductTemplateQuery } from '@aff-services/shared/models/dtos';
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

  async getProducts(data: CrawlProductQuery) {
    this.logger.log(`${this.getProducts.name} called`);
    return await this.client.send({ cmd: CMD.ADMIN_GET_PRODUCTS }, data).toPromise();
  }

  async updateProductTemplate() {
    this.logger.log(`${this.updateProductTemplate.name} called`);
    this.client.send({ cmd: CMD.ADMIN_UPDATE_PRODUCT_TEMPLATE }, {}).toPromise();
    return { message: 'created update product template request' };
  }

  async adminGetProductTemplates(data: ProductTemplateQuery) {
    this.logger.log(`${this.adminGetProductTemplates.name} called`);
    return await this.client.send({ cmd: CMD.ADMIN_GET_PRODUCT_TEMPLATE }, data).toPromise();
  }

  async adminGetProductDetail(id: number) {
    this.logger.log(`${this.adminGetProductDetail.name} called`);
    return await this.client.send({ cmd: CMD.ADMIN_GET_PRODUCT_TEMPLATE_DETAIL }, { id }).toPromise();
  }
}
