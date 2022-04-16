import { SwaggerException, SwaggerHeaders } from '@aff-services/shared/common/swagger';
import { Body, Controller, Get, HttpException, Logger, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { AccessControlService } from '../../services/access-control/access-control.service';
import {
  AssignPermissionDTO,
  BaseResponse,
  CreateRoleDTO,
  PagingPermissionResponse,
  PagingRoleResponse,
  UpdateRoleDTO,
  UpdateRoleParam,
} from '@aff-services/shared/models/dtos';

@ApiTags('Access Control')
@UseGuards(JwtAuthGuard)
@SwaggerHeaders()
@SwaggerException()
@Controller('admin/access-control')
export class AccessControlController {
  private readonly logger = new Logger(`Api-Gateway.${AccessControlController.name}`);
  constructor(private readonly accessCcontrolService: AccessControlService) {}

  @ApiResponse({ status: 200, type: PagingPermissionResponse })
  @ApiOperation({ summary: 'Danh sách quyền' })
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
  @ApiOperation({ summary: 'Danh sách chức vụ' })
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
  @ApiOperation({ summary: 'Tạo chức vụ' })
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
  @ApiOperation({ summary: 'Cập nhật chức vụ' })
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

  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiOperation({ summary: 'Thêm quyền cho chức vụ' })
  @Post('role/:roleId')
  async assignPermission(@Res() res: Response, @Body() data: AssignPermissionDTO, @Param() params: UpdateRoleParam) {
    try {
      this.logger.log(`${this.assignPermission.name} called Data:${JSON.stringify(data)}`);
      const result = await this.accessCcontrolService.assignPermission(AssignPermissionDTO.from(params, data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
