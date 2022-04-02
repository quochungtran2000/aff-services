import { SwaggerException, SwaggerHeaders } from '@aff-services/shared/common/swagger';
import { PagingPermissionResponse } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Req, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PermissionService } from '../../services/permission/permission.service';

@ApiTags('Permission')
@SwaggerHeaders()
@SwaggerException()
@Controller('admin/permission')
export class PermissionController {
  private readonly logger = new Logger(`Api-Gateway.${PermissionController.name}`);
  constructor(private readonly permissionSerivce: PermissionService) {}

  @ApiResponse({ status: 200, type: PagingPermissionResponse })
  @Get('permission')
  async getPermissions(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.getPermissions.name} called`);
      const result = await this.permissionSerivce.getPermissions();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
