import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';
import { CommentController } from './controllers/comment/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { CategoryController } from './controllers/category/category.controller';
import { CategoryService } from './services/category/category.service';

@Module({
  controllers: [WebsiteController, ProductController, CommentController, UserController, CategoryController],
  providers: [WebsiteService, ProductService, CommentService, UserService, CategoryService],
})
export class WebsiteModule {}
