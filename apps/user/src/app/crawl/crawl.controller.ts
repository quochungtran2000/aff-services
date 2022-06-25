import { GetCrawlProductHistoryQuery } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CrawlService } from './crawl.service';

@Controller('crawl')
export class CrawlController {
  private readonly logger = new Logger(`Micro-User.${CrawlController.name}`);
  constructor(private readonly crawlService: CrawlService) {}

  @MessagePattern({ cmd: CMD.GET_CRAWL_HISTORY })
  getCrawlHistory(data: any) {
    this.logger.log(`${this.getCrawlHistory.name} called`);
    return this.crawlService.getCrawlHistory(data);
  }

  @MessagePattern({ cmd: CMD.GET_CRAWL_PRODUCT_HISTORY })
  getCrawlProductHistory(data: GetCrawlProductHistoryQuery) {
    this.logger.log(`${this.getCrawlProductHistory.name} called`);
    return this.crawlService.getCrawlProductHistory(data);
  }
}
