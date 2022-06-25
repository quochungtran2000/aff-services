import {
  CrawlProductQuery,
  CreateAffLinkPayload,
  PagingProductTemplateResponse,
  ProductTemplateDetailResponse,
  ProductTemplateQuery,
} from '@aff-services/shared/models/dtos';
import { Body, Controller, Get, HttpException, Logger, Param, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductService } from '../../services/product/product.service';

@ApiTags('Sản phẩm')
@Controller('admin/product')
export class ProductController {
  private readonly logger = new Logger(`Api-Gateway.${ProductController.name}`);
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Res() res: Response, @Query() data: CrawlProductQuery) {
    try {
      this.logger.log(`${this.getProducts.name} called`);
      const result = await this.productService.getProducts(CrawlProductQuery.from(data));
      res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('template')
  async updateProductTemplate(@Res() res: Response) {
    try {
      this.logger.log(`${this.updateProductTemplate.name} called`);
      const result = await this.productService.updateProductTemplate();
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Danh sách sản phẩm' })
  @ApiResponse({ type: PagingProductTemplateResponse })
  @Get('template')
  async adminGetProductTemplates(@Res() res: Response, @Query() data: ProductTemplateQuery) {
    try {
      this.logger.log(`${this.adminGetProductTemplates.name} called`);
      const result = await this.productService.adminGetProductTemplates(ProductTemplateQuery.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  @ApiResponse({ type: ProductTemplateDetailResponse })
  @Get('template/:id')
  async adminGetProductDetail(@Res() res: Response, @Param('id') id: number) {
    try {
      this.logger.log(`${this.adminGetProductDetail.name} called`);
      const result = await this.productService.adminGetProductDetail(id);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Post('aff-link')
  async createAffLink(@Res() res: Response, @Body() data: CreateAffLinkPayload) {
    try {
      this.logger.log(`${this.createAffLink.name} called`);
      const result = await this.productService.createAffLink(data);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
