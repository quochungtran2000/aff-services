import { SwaggerException, SwaggerHeaders } from '@aff-services/shared/common/swagger';
import { Body, Controller, Get, HttpException, Logger, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AccessControlService } from '../../services/access-control/access-control.service';
import {
  BaseResponse,
  CreateRoleDTO,
  PagingPermissionResponse,
  PagingRoleResponse,
  UpdateRoleDTO,
  UpdateRoleParam,
} from '@aff-services/shared/models/dtos';

@ApiTags('Access Control')
// @UseGuards(JwtAuthGuard)
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

  @ApiResponse({ status: 200, type: PagingRoleResponse })
  @Get('role')
  async getRoles(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.getRoles.name} called`);
      const result = await this.accessCcontrolService.getRoles();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiResponse({ status: 201, type: BaseResponse })
  @Post('role')
  async createRole(@Req() req: Request, @Res() res: Response, @Body() data: CreateRoleDTO) {
    try {
      this.logger.log(`${this.createRole.name} called Data:${JSON.stringify(data)}`);
      const result = await this.accessCcontrolService.createRole(CreateRoleDTO.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiResponse({ status: 200, type: BaseResponse })
  @Put('role/:roleId')
  async updateRole(@Res() res: Response, @Body() data: UpdateRoleDTO, @Param() params: UpdateRoleParam) {
    try {
      this.logger.log(`${this.updateRole.name} called Data:${JSON.stringify(data)}`);
      const result = await this.accessCcontrolService.updateRole(UpdateRoleDTO.from(params, data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
