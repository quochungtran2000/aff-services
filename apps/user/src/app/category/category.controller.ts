import { CrawlCategoryResponse, EcommerceCategoryQuery } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  private readonly logger = new Logger(`Micro-User.${CategoryController.name}`);
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern({ cmd: CMD.ADMIN_GET_ECOMMERCE_CATEGORY })
  getEcommerceCategory(data: EcommerceCategoryQuery): Promise<CrawlCategoryResponse[]> {
    this.logger.log(`${this.getEcommerceCategory.name} called`);
    return this.categoryService.getEcommerceCategory(data);
  }
}
