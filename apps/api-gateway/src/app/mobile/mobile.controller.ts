import { Controller, Get, Logger } from '@nestjs/common';
import { MobileService } from './mobile.service';

@Controller('mobile')
export class MobileController {
  private readonly logger = new Logger(`Api-Gateway.${MobileController.name}`);
  constructor(private readonly mobileService: MobileService) {}

  @Get()
  getData() {
    this.logger.log(`${this.getData.name} called`);
    return this.mobileService.getData();
  }
}
