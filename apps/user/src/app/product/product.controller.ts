import { ProductTemplateQuery } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger(`Micro-User.${ProductController.name}`);
  constructor(private readonly productService: ProductService) {}

  //  Admin

  @MessagePattern({ cmd: CMD.ADMIN_GET_PRODUCTS })
  adminGetProduct() {
    this.logger.log(`${this.adminGetProduct.name} called`);
    return this.productService.adminGetProduct();
  }

  @MessagePattern({ cmd: CMD.ADMIN_UPDATE_PRODUCT_TEMPLATE })
  adminUpdateProductTemplate() {
    this.logger.log(`${this.adminUpdateProductTemplate.name} called`);
    return this.productService.adminUpdateProductTemplate();
  }

  @MessagePattern({ cmd: CMD.ADMIN_GET_PRODUCT_TEMPLATE })
  admingetProductTemplate(data: ProductTemplateQuery) {
    this.logger.log(`${this.admingetProductTemplate.name} called`);
    return this.productService.admingetProductTemplate(data);
  }

  @MessagePattern({ cmd: CMD.ADMIN_GET_PRODUCT_TEMPLATE_DETAIL })
  adminGetProductTemplateDetail({ id }: { id: number }) {
    this.logger.log(`${this.admingetProductTemplate.name} called`);
    return this.productService.adminGetProductTemplateDetail(id);
  }

  //  Website
  @MessagePattern({ cmd: CMD.WEBSITE_GET_PRODUCTS })
  websiteGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.websiteGetProducts.name} called`);
    return this.productService.websiteGetProducts(data);
  }

  @MessagePattern({ cmd: CMD.WEBSITE_GET_PRODUCT })
  websiteGetProduct({ id }: { id: number }) {
    this.logger.log(`${this.websiteGetProduct.name} called`);
    return this.productService.websiteGetProduct(id);
  }

  //  Mobile

  @MessagePattern({ cmd: CMD.MOBILE_GET_PRODUCTS })
  mobileGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.mobileGetProducts.name} called`);
    return this.productService.mobileGetProducts(data);
  }

  @MessagePattern({ cmd: CMD.MOBILE_GET_PRODUCT })
  mobileGetProduct({ id }: { id: number }) {
    this.logger.log(`${this.mobileGetProduct.name} called`);
    return this.productService.mobileGetProduct(id);
  }
}
