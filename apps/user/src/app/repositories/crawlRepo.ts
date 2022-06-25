import { GetCrawlProductHistoryQuery } from '@aff-services/shared/models/dtos';
import {
  CATEGORY,
  CRAWL_CATEGORY,
  CRAWL_HISTORY,
  CRAWL_PRODUCT_HISTORY,
  MAPPING_CATEGORY,
} from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class crawlRepo {
  private readonly logger = new Logger(`Micro-User.${crawlRepo.name}`);
  constructor(
    @Inject('CRAWL_HISTORY_REPOSITORY') private readonly crawlHistory: Repository<CRAWL_HISTORY>,
    @Inject('CRAWL_PRODUCT_HISTORY_REPOSITORY') private readonly crawlProductHistory: Repository<CRAWL_PRODUCT_HISTORY>
  ) {}

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

  async getCrawlProductHistory(query: GetCrawlProductHistoryQuery) {
    try {
      const { id, search, pageSize, skip } = query;
      this.logger.log(`${this.getCrawlProductHistory.name} called Query:${id}`);
      const qr = this.crawlProductHistory
        .createQueryBuilder('cph')
        .leftJoinAndSelect('cph.product', 'p')
        .where('1 = 1')
        .andWhere('cph.crawl_history_id = :id');

      if (search)
        qr.andWhere(`(cph.product_id like '%' || :search || '%' or UPPER(p.name) like '%' || UPPER(:search) || '%')`);

      const [data, total] = await qr
        .take(pageSize)
        .skip(skip)
        .orderBy('cph.updatedAt', 'DESC')
        .setParameters({ id, search, pageSize, skip })
        .getManyAndCount();
      return { total, data };
    } catch (error) {
      this.logger.error(`${this.getCrawlProductHistory.name} Error:${error.message}`);
    }
  }
}
