import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from '../../database/database.module';
import { categoryProviders } from '../providers/category.providers';
import { CategoryRepo } from '../repositories/categoryRepo';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo, ...categoryProviders],
})
export class CategoryModule {}
