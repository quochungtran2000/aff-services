import { CrawlCategoryResponse, EcommerceCategoryQuery } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AccessControlService } from '../access-control/access-control.service';

@Injectable()
export class CategoryService {
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

  async getEcommerceCategory(query: EcommerceCategoryQuery): Promise<CrawlCategoryResponse[]> {
    this.logger.log(`${this.getEcommerceCategory.name} query:${JSON.stringify(query)}`);
    return await this.client
      .send<CrawlCategoryResponse[]>({ cmd: CMD.ADMIN_GET_ECOMMERCE_CATEGORY }, query)
      .toPromise();
  }
}
