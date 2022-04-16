import { ProductTemplateQuery } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ProductRepo } from '../repositories/productRepo';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(`Micro-User.${ProductService.name}`);
  constructor(private readonly productRepo: ProductRepo) {}

  async adminGetProduct() {
    this.logger.log(`${this.adminGetProduct.name} called`);
    return await this.productRepo.findAndCount();
  }

  async adminUpdateProductTemplate() {
    this.logger.log(`${this.adminGetProduct.name} called`);
    return await this.productRepo.adminUpdateProductTemplate();
  }

  async admingetProductTemplate(data: ProductTemplateQuery) {
    this.logger.log(`${this.admingetProductTemplate.name} called`);
    return await this.productRepo.getProductTemplate(data);
  }

  async adminGetProductTemplateDetail(id: number) {
    this.logger.log(`${this.adminGetProductTemplateDetail.name} called`);
    return await this.productRepo.getProductTemplateDetail(id);
  }

  async websiteGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.websiteGetProducts.name} called`);
    return await this.productRepo.getProductTemplate(data);
  }

  async websiteGetProduct(id: number) {
    this.logger.log(`${this.websiteGetProduct.name} called`);
    return await this.productRepo.getProductTemplateDetail(id);
  }

  async mobileGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.mobileGetProducts.name} called`);
    return await this.productRepo.getProductTemplate(data);
  }

  async mobileGetProduct(id: number) {
    this.logger.log(`${this.mobileGetProduct.name} called`);
    return await this.productRepo.getProductTemplateDetail(id);
  }
}
