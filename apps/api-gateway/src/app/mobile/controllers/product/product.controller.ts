import {
  PagingProductTemplateResponse,
  ProductTemplateDetailResponse,
  ProductTemplateQuery,
} from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Param, Query, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProductService } from '../../services/product/product.service';

@ApiTags('Product')
@Controller('mobile/product')
export class ProductController {
  private readonly logger = new Logger(`Api-Gateway.${ProductController.name}`);
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({ type: PagingProductTemplateResponse })
  @Get('')
  async websiteGetProducts(@Res() res: Response, @Query() data: ProductTemplateQuery) {
    try {
      this.logger.log(`${this.websiteGetProducts.name} called`);
      const result = await this.productService.mobileGetProducts(ProductTemplateQuery.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiResponse({ type: ProductTemplateDetailResponse })
  @Get(':id')
  async websiteGetProduct(@Res() res: Response, @Param('id') id: number) {
    try {
      this.logger.log(`${this.websiteGetProduct.name} called`);
      const result = await this.productService.mobileGetProduct(id);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
