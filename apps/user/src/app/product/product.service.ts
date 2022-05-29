import { ProductTemplateQuery, SaveProductTemplateParamDTO } from '@aff-services/shared/models/dtos';
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
    // return await this.productRepo.adminUpdateProductTemplate();
    return;
  }

  async admingetProductTemplate(data: ProductTemplateQuery) {
    this.logger.log(`${this.admingetProductTemplate.name} called`);
    return await this.productRepo.getProductTemplateV2(data);
  }

  async adminGetProductTemplateDetail(id: number) {
    this.logger.log(`${this.adminGetProductTemplateDetail.name} called`);
    return this.productRepo.getProductTemplateDetailV2(id);
  }

  async websiteGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.websiteGetProducts.name} called`);
    return await this.productRepo.getProductTemplateV2(data);
  }

  async websiteGetProduct(id: number) {
    this.logger.log(`${this.websiteGetProduct.name} called`);
    return await this.productRepo.getProductTemplateDetailV2(id);
  }

  async mobileGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.mobileGetProducts.name} called`);
    return await this.productRepo.getProductTemplateV2(data);
  }

  async mobileGetProduct(id: number) {
    this.logger.log(`${this.mobileGetProduct.name} called`);
    return await this.productRepo.getProductTemplateDetailV2(id);
  }

  async getEcommerceProductComment(productId: string) {
    this.logger.log(`${this.getEcommerceProductComment.name} called`);
    return await this.productRepo.getEcommerceProductComment(productId);
  }

  async userSaveProduct(data: SaveProductTemplateParamDTO) {
    this.logger.log(`${this.userSaveProduct.name} called`);
    return await this.productRepo.userSaveProduct(data);
  }

  async getSaveProduct(userId: number) {
    this.logger.log(`${this.getSaveProduct.name} called`);
    return await this.productRepo.getSaveProduct(userId);
  }
}
