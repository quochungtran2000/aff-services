import { Module } from '@nestjs/common';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
import { ProductService } from './services/product/product.service';
import { ProductController } from './controllers/product/product.controller';
import { CommentController } from './controllers/comment/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';

@Module({
  imports: [],
  controllers: [MobileController, ProductController, CommentController, UserController],
  providers: [MobileService, ProductService, CommentService, UserService],
})
export class MobileModule {}
