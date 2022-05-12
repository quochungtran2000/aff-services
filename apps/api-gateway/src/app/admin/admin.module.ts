import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { AccessControlController } from './controllers/access-control/access-control.controller';
import { AccessControlService } from './services/access-control/access-control.service';
import { CrawlController } from './controllers/crawl/crawl.controller';
import { CrawlService } from './services/crawl/crawl.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';
import { CategoryController } from './controllers/category/category.controller';
import { CategoryService } from './services/category/category.service';

@Module({
  imports: [],
  controllers: [
    AdminController,
    UserController,
    AccessControlController,
    CrawlController,
    ProductController,
    CategoryController,
  ],
  providers: [AdminService, UserService, AccessControlService, CrawlService, ProductService, CategoryService],
})
export class AdminModule {}
