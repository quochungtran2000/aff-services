import { CategoryResponse } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service';

@ApiTags('Danh mục')
@Controller('mobile/category')
export class CategoryController {
  private readonly logger = new Logger(`Api-Gateway.${CategoryController.name}`);
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Lấy danh mục trên thiết bị di động' })
  @ApiResponse({ status: 200, type: CategoryResponse, isArray: true })
  @Get()
  async mobileGetCategory(@Res() res: Response, @Req() req: Request) {
    try {
      this.logger.log(`${this.mobileGetCategory.name} called`);
      const result = await this.categoryService.mobileGetCategory();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.mobileGetCategory.name} Done`);
    }
  }
}
