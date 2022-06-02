import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { postProviders } from '../providers/post.providers';
import { PostRepo } from '../repositories/postRepo';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService, PostRepo, ...postProviders],
})
export class PostModule {}
