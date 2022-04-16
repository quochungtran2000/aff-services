import { Controller, Get, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { WebsiteService } from './website.service';

@Controller('website')
export class WebsiteController {
  private readonly logger = new Logger(`Api-Gateway.${WebsiteController.name}`);
  constructor(private readonly websiteService: WebsiteService) {}

  @Get()
  getData(@Res() res: Response) {
    this.logger.log(`${this.getData.name} called`);
    const result = this.websiteService.getData();
    return res.status(200).json(result);
  }
}
