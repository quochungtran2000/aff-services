import {
  CommentPostDTO,
  CreatePostDTO,
  DeletePostDTO,
  GetMyPostsQueryDTO,
  GetPostQueryDTO,
  SavePostParamDTO,
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

  @MessagePattern({ cmd: CMD.USER_SAVE_POST })
  userSavePost(data: SavePostParamDTO) {
    this.logger.log(`${this.userSavePost.name} called`);
    return this.postService.userSavePost(data);
  }

  @MessagePattern({ cmd: CMD.GET_SAVE_POST })
  getSavePost({ userId }: { userId: number }) {
    this.logger.log(`${this.getSavePost.name} called`);
    return this.postService.getSavePost(userId);
  }

  @MessagePattern({ cmd: CMD.COMMENT_POST })
  commentPost(data: CommentPostDTO) {
    this.logger.log(`${this.commentPost.name} called`);
    return this.postService.commentPost(data);
  }

  @MessagePattern({ cmd: CMD.GET_POST_COMMENT })
  getPostComments({ postId }: { postId: number }) {
    this.logger.log(`${this.getPostComments.name} called`);
    return this.postService.getPostComments(postId);
  }
}
