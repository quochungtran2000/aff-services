import {
  CreateCategoryDTO,
  EcommerceCategoryQuery,
  UpdateEcommerceCategoryDTO,
} from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepo } from '../repositories/categoryRepo';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(`Micro-User.${CategoryService.name}`);
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async getEcommerceCategory(query: EcommerceCategoryQuery) {
    this.logger.log(`${this.getEcommerceCategory.name} called`);
    return await this.categoryRepo.getCateGories(query);
  }

  async updateEcommerceCategory(data: UpdateEcommerceCategoryDTO) {
    this.logger.log(`${this.updateEcommerceCategory.name} called`);
    return await this.categoryRepo.updateEcommerceCategory(data);
  }

  async createCategory(data: CreateCategoryDTO) {
    this.logger.log(`${this.createCategory.name} called`);
    return await this.categoryRepo.createCategory(data);
  }

  async getCategory() {
    this.logger.log(`${this.getCategory.name} called`);
    return await this.categoryRepo.getCategory();
  }
}
