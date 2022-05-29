import {
  MyProfileResponse,
  PagingProductTemplateResponse,
  ProductTemplateDetailResponse,
  ProductTemplateQuery,
  SaveProductTemplateParamDTO,
} from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { query, Request, Response, Router } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ProductService } from '../../services/product/product.service';

// @SwaggerHeaders()
@ApiTags('Sản Phẩm')
@Controller('website/product')
export class ProductController {
  private readonly logger = new Logger(`Api-Gateway.${ProductController.name}`);
  constructor(private readonly productService: ProductService) {}

  // @Get()
  // async getProducts(@Req() req: Request, @Res() res: Response) {
  //   this.logger.log(`${this.getProducts.name} called`);
  //   const reuslt = await this.productService.getProducts();
  //   return res.status(200).json(reuslt);
  // }

  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiResponse({ type: PagingProductTemplateResponse })
  @Get()
  async websiteGetProducts(@Res() res: Response, @Query() data: ProductTemplateQuery) {
    try {
      this.logger.log(`${this.websiteGetProducts.name} called`);
      const result = await this.productService.websiteGetProducts(ProductTemplateQuery.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.websiteGetProducts.name} Done`);
    }
  }

  @ApiOperation({ summary: 'Lấy thông chi tiết một sản phẩm' })
  @ApiResponse({ type: ProductTemplateDetailResponse })
  @Get(':id')
  async websiteGetProduct(@Res() res: Response, @Param('id') id: number) {
    try {
      this.logger.log(`${this.websiteGetProduct.name} called`);
      const result = await this.productService.websiteGetProduct(id);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.websiteGetProduct.name} Done`);
    }
  }

  @ApiOperation({ summary: 'Lưu sản phẩm để xem sau' })
  @UseGuards(JwtAuthGuard)
  @Post('/save/:productId')
  async websiteSaveProduct(@Res() res: Response, @Req() req: Request, @Param() data: SaveProductTemplateParamDTO) {
    try {
      this.logger.log(`${this.websiteSaveProduct.name} called`);
      data.userId = (req.user as MyProfileResponse).userId;
      const result = await this.productService.websiteSaveProduct(SaveProductTemplateParamDTO.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.websiteSaveProduct.name} Done`);
    }
  }
}
