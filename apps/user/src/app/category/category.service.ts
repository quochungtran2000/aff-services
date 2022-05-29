import {
  CreateCategoryDTO,
  EcommerceCategoryQuery,
  UpdateCategoryDTO,
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

  async updateCategory(data: UpdateCategoryDTO) {
    this.logger.log(`${this.updateCategory.name} called`);
    return await this.categoryRepo.updateCategory(data);
  }

  async deleteCategory(categoryId: number) {
    this.logger.log(`${this.deleteCategory.name} called`);
    return await this.categoryRepo.deleteCategory(categoryId);
  }

  async getApplicationsCategory(application) {
    this.logger.log(`${this.getApplicationsCategory.name} called`);
    return await this.categoryRepo.getApplicationsCategory(application);
  }
}
