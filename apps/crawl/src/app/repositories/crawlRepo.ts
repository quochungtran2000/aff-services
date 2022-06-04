import { CRAWL_HISTORY } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlRepo {
  private readonly logger = new Logger(`Micro-Crawl.${CrawlRepo.name}`);
  constructor(@Inject('CRAWL_HISTORY_REPOSITORY') private readonly crawlRepo: Repository<CRAWL_HISTORY>) {}

  async create() {
    return await this.crawlRepo
      .createQueryBuilder()
      .insert()
      .into(CRAWL_HISTORY)
      .values({ status: 'pending' })
      .execute();
  }

  async updateToCrawling(id: number) {
    return await this.crawlRepo
      .createQueryBuilder()
      .update(CRAWL_HISTORY)
      .set({ status: 'crawling' })
      .where('id = :id', { id })
      .execute();
  }

  async getAll() {
    this.logger.log(`${this.getAll.name} called`);
    return await this.crawlRepo.createQueryBuilder('c').getMany();
  }
}
