import { SwaggerException, SwaggerHeaders } from '@aff-services/shared/common/swagger';
import { PagingPermissionResponse } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AccessControlService } from '../../services/access-control/access-control.service';

@ApiTags('Access Control')
@UseGuards(JwtAuthGuard)
@SwaggerHeaders()
@SwaggerException()
@Controller('admin/access-control')
export class AccessControlController {
  private readonly logger = new Logger(`Api-Gateway.${AccessControlController.name}`);
  constructor(private readonly accessCcontrolService: AccessControlService) {}

  @ApiResponse({ status: 200, type: PagingPermissionResponse })
  @Get('permission')
  async getPermissions(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.getPermissions.name} called`);
      const result = await this.accessCcontrolService.getPermissions();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
