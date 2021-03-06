import { CrawlPayload } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class CrawlService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${CrawlService.name}`);
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

  async crawlData(data: CrawlPayload) {
    this.logger.log(`${this.crawlData.name} called`);
    this.client.send({ cmd: CMD.CRAWL_DATA }, data).toPromise();
    return { message: 'Created crawl request' };
  }

  async crawlCategory() {
    this.logger.log(`${this.crawlCategory.name} called`);
    this.client.send({ cmd: CMD.CRAWL_CATEGORY }, {}).toPromise();
    return { message: 'Created crawl category request' };
    // return await this.client.send({ cmd: CMD.CRAWL_CATEGORY }, {}).toPromise();
  }

  async getConfig() {
    return await this.client.send({ cmd: CMD.GET_CONFIG }, {}).toPromise();
  }

  async getCategory(merchant: string) {
    return await this.client.send({ cmd: CMD.GET_CATEGORY }, { merchant }).toPromise();
  }
}
