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

  async crawlData() {
    this.logger.log(`${this.crawlData.name} called`);
    const result = await this.client.send({ cmd: CMD.CREATE_CRAWL_HISTORY }, {}).toPromise();
    this.client.send({ cmd: CMD.CRAWL_DATA }, result).toPromise();
    return { message: 'Created crawl request', data: result };
    // return result
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

  async getCrawlHistory(query: any) {
    return await this.client.send({ cmd: CMD.GET_CRAWL_HISTORY }, query).toPromise();
  }
}
