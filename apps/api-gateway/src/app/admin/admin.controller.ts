import { Controller, Get, Logger } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(`Api-Gateway.${AdminController.name}`);
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getData() {
    this.logger.log(`${this.getData.name} called`);
    return this.adminService.getData();
  }
}
