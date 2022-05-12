import { EcommerceCategoryQuery } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepo } from '../repositories/categoryRepo';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(`Micro-User.${CategoryService.name}`);
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async getEcommerceCategory(query: EcommerceCategoryQuery){
    this.logger.log(`${this.getEcommerceCategory.name} called`)
    return await this.categoryRepo.getCateGories(query)
  }
}
