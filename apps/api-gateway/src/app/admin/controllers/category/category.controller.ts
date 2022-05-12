import { EcommerceCategoryQuery } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service';

@ApiTags('Danh mục')
@Controller('admin/category')
export class CategoryController {
  private readonly logger = new Logger(`Api-Gateway.${CategoryController.name}`);
  constructor(private readonly categoryService: CategoryService) {}

  // @ApiResponse({ status: 200, type: PagingPermissionResponse })
  @ApiOperation({ summary: 'Danh mục theo sàn thương mại điện tử' })
  @Get('ecommerce')
  async getPermissions(@Req() req: Request, @Res() res: Response, @Query() query: EcommerceCategoryQuery) {
    try {
      this.logger.log(`${this.getPermissions.name} called query:${JSON.stringify(query)}`);
      const result = await this.categoryService.getEcommerceCategory(query);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
