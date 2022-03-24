import { UserQueryDTO } from '@aff-services/shared/models/dtos';
import { Controller, Get, Logger, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(`Api-Gateway.${AppController.name}`);
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/user')
  async getUser(@Req() req: Request, @Res() res: Response, @Query() query: UserQueryDTO) {
    this.logger.log(`${this.getUser.name} called`);
    const result = await this.appService.getUser(UserQueryDTO.from(query));
    res.status(200).json(result);
  }
}
