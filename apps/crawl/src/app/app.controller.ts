import { CrawlPayload } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  @MessagePattern({ cmd: 'crawl' })
  getData() {
    return this.appService.getData();
  }

  // @MessagePattern({ cmd: 'product' })
  // getProducts() {
  //   return this.appService.getProducts();
  // }

  @MessagePattern({ cmd: CMD.GET_CONFIG })
  getConfig() {
    return this.appService.getConfigs();
  }
}
