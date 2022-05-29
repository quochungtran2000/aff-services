import { Module } from '@nestjs/common';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { ProductController } from './controllers/product/product.controller';
import { ProductService } from './services/product/product.service';
import { CommentController } from './controllers/comment/comment.controller';
import { CommentService } from './services/comment/comment.service';

@Module({
  controllers: [WebsiteController, ProductController, CommentController],
  providers: [WebsiteService, ProductService, CommentService],
})
export class WebsiteModule {}
