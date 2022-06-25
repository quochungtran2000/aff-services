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
  crawlData(data: any) {
    this.logger.log(`${this.crawlData.name}`);
    return this.crawlService.crawlProductsV3(data);
  }

  @MessagePattern({ cmd: CMD.CREATE_CRAWL_HISTORY })
  creatCrwalHistory() {
    this.logger.log(`${this.creatCrwalHistory.name}`);
    return this.crawlService.createCrawlProcess();
  }

  @MessagePattern({ cmd: CMD.CRAWL_CATEGORY })
  crawlCategory() {
    this.logger.log(`${this.crawlCategory.name}`);
    return this.crawlService.crawlCategory();
  }

  @MessagePattern({ cmd: CMD.GET_CATEGORY })
  getCateGory({ merchant }: { merchant }) {
    return this.crawlService.getCategory(merchant);
  }

  @MessagePattern({ cmd: CMD.CUSTOM_CRAWL })
  customCrawl({ url }: { url: string }) {
    return this.crawlService.customCrawl(url);
  }
}
