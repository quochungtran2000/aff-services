import { CATEGORY, CRAWL_CATEGORY, CRAWL_HISTORY, MAPPING_CATEGORY } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class crawlRepo {
  private readonly logger = new Logger(`Micro-User.${crawlRepo.name}`);
  constructor(@Inject('CRAWL_HISTORY_REPOSITORY') private readonly crawlHistory: Repository<CRAWL_HISTORY>) {}

  async getManyAndCount(query: any) {
    try {
      this.logger.log(`${this.getManyAndCount.name} called Query:${JSON.stringify(query)}`);
      const [data, total] = await this.crawlHistory
        .createQueryBuilder('ch')
        .where('1 = 1')
        .orderBy('ch.crawl_history_id', 'DESC')
        .getManyAndCount();
      return { total, data };
    } catch (error) {
      this.logger.error(`${this.getManyAndCount.name} Error:${error.message}`);
    } finally {
      this.logger.log(`${this.getManyAndCount.name} Done `);
    }
  }
}
