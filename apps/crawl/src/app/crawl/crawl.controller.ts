import { CrawlPayload } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CrawlService } from './crawl.service';

@Controller('crawl')
export class CrawlController {
  private readonly logger = new Logger(`Micro-Crawl.${CrawlController.name}`);
  constructor(private readonly crawlService: CrawlService) {}

  @MessagePattern({ cmd: CMD.CRAWL_DATA })
  crawlData(data: CrawlPayload) {
    this.logger.log(`${this.crawlData.name}`);
    return this.crawlService.crawlData(data);
  }

  @MessagePattern({ cmd: CMD.CRAWL_CATEGORY })
  crawlCategory(data: any) {
    this.logger.log(`${this.crawlCategory.name}`);
    return this.crawlService.crawlCategory(data);
  }
}
