import { ConfigPayload } from '@aff-services/shared/models/dtos';
import { Body, Controller, Delete, Get, HttpException, Logger, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
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

  @Get('config')
  async getConfigs(@Res() res: Response, @Req() req: Request) {
    try {
      this.logger.log(`${this.getConfigs.name} called`);
      const result = await this.adminService.getConfigs();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('config')
  async createConfig(@Res() res: Response, @Req() req: Request, @Body() data: ConfigPayload) {
    try {
      this.logger.log(`${this.createConfig.name} called`);
      const result = await this.adminService.createConfig(data);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('config')
  async updateConfig(@Res() res: Response, @Req() req: Request, @Body() data: ConfigPayload) {
    try {
      this.logger.log(`${this.updateConfig.name} called`);
      const result = await this.adminService.updateConfig(data);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('config/:configName')
  async deleteConfig(@Res() res: Response, @Req() req: Request, @Param('configName') configName: string) {
    try {
      this.logger.log(`${this.deleteConfig.name} called`);
      const result = await this.adminService.deleteConfig(configName);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('finance-report')
  async getFinaceReport(@Res() res: Response, @Req() req: Request) {
    try {
      this.logger.log(`${this.getFinaceReport.name} called`);
      const result = await this.adminService.getFinaceReport();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
