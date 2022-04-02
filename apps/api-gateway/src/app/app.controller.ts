import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(`Api-Gateway.${AppController.name}`);
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    this.logger.log(`${this.getData.name} called`);
    return this.appService.getData();
  }
}
