import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ProductService } from '../../services/product/product.service';

@ApiTags('Product')
@Controller('website/product')
export class ProductController {
  private readonly logger = new Logger(`Api-Gateway.${ProductController.name}`);
  constructor(private readonly productService: ProductService) {}

  @Get()
  getData(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`${this.getData.name} called`);
    const reuslt = this.productService.getData();
    return res.status(200).json(reuslt);
  }
}
