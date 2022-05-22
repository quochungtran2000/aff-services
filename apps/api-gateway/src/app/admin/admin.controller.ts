import { Controller, Get, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(`Api-Gateway.${AdminController.name}`);
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getData(@Res() res: Response) {
    this.logger.log(`${this.getData.name} called`);
    const result = await this.adminService.getData();
    return res.status(200).json(result);
  }
}
