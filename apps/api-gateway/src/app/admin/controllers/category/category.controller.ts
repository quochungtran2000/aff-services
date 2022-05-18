import {
  BaseResponse,
  CrawlCategoryResponse,
  CreateCategoryDTO,
  EcommerceCategoryQuery,
  UpdateEcommerceCategoryDTO,
} from '@aff-services/shared/models/dtos';
import { Body, Controller, Get, HttpException, Logger, Post, Put, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CategoryService } from '../../services/category/category.service';

@ApiTags('Danh mục')
@Controller('admin/category')
export class CategoryController {
  private readonly logger = new Logger(`Api-Gateway.${CategoryController.name}`);
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({ status: 200, type: CrawlCategoryResponse, isArray: true })
  @ApiOperation({ summary: 'Danh mục theo sàn thương mại điện tử' })
  @Get('ecommerce')
  async getEcommerceCategory(@Req() req: Request, @Res() res: Response, @Query() query: EcommerceCategoryQuery) {
    try {
      this.logger.log(`${this.getEcommerceCategory.name} called`);
      const result = await this.categoryService.getEcommerceCategory(query);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiOperation({ summary: 'Cập nhật danh theo sàn thương mại điện tử' })
  @Put('ecommerce')
  async updateEcommerceCategory(@Req() req: Request, @Res() res: Response, @Body() data: UpdateEcommerceCategoryDTO) {
    try {
      this.logger.log(`${this.updateEcommerceCategory.name} called  `);
      const result = await this.categoryService.updateEcommerceCategory(UpdateEcommerceCategoryDTO.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiOperation({ summary: 'Danh mục website và app' })
  @Get()
  async getCategory(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.getCategory.name} called`);
      const result = await this.categoryService.getCategory();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiOperation({ summary: 'Dùng để tạo danh mục' })
  @Post()
  async createCategory(@Req() req: Request, @Res() res: Response, @Body() data: CreateCategoryDTO) {
    try {
      this.logger.log(`${this.getCategory.name} called`);
      const result = await this.categoryService.createCategory(data);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
