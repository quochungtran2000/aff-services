import {
  CreatePostDTO,
  DeletePostDTO,
  GetMyPostsQueryDTO,
  GetPostQueryDTO,
  UpdatePostDTO,
} from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  private readonly logger = new Logger(`Micro-User.${PostController.name}`);
  constructor(private readonly postService: PostService) {}

  @MessagePattern({ cmd: CMD.CREATE_POST })
  createPost(data: CreatePostDTO) {
    this.logger.log(`${this.createPost.name} called`);
    return this.postService.createPost(data);
  }

  @MessagePattern({ cmd: CMD.GET_POSTS })
  getPosts(query: GetPostQueryDTO) {
    this.logger.log(`${this.getPosts.name} called`);
    return this.postService.getPosts(query);
  }

  @MessagePattern({ cmd: CMD.GET_POST })
  getPost({ postId }: { postId: number }) {
    this.logger.log(`${this.getPost.name} called`);
    return this.postService.getPost(postId);
  }

  @MessagePattern({ cmd: CMD.GET_MY_POSTS })
  getMyPosts(query: GetMyPostsQueryDTO) {
    this.logger.log(`${this.getMyPosts.name} called`);
    return this.postService.getMyPosts(query);
  }

  @MessagePattern({ cmd: CMD.UPDATE_POST })
  updatePost(data: UpdatePostDTO) {
    this.logger.log(`${this.updatePost.name} called`);
    return this.postService.updatePost(data);
  }

  @MessagePattern({ cmd: CMD.DELETE_POST })
  deletePost(data: DeletePostDTO) {
    this.logger.log(`${this.deletePost.name} called`);
    return this.postService.deletePost(data);
  }
}
