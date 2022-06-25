import { GetCrawlProductHistoryQuery } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { crawlRepo } from '../repositories/crawlRepo';

@Injectable()
export class CrawlService {
  private readonly logger = new Logger(`Micro-User.${CrawlService.name}`);
  constructor(private readonly crawlRepo: crawlRepo) {}

  async getCrawlHistory(query: any) {
    this.logger.log(`${this.getCrawlHistory.name}`);
    return await this.crawlRepo.getManyAndCount(query);
  }

  async getCrawlProductHistory(data: GetCrawlProductHistoryQuery) {
    return this.crawlRepo.getCrawlProductHistory(data);
  }
}
