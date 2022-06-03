import {
  CreatePostDTO,
  DeletePostDTO,
  GetMyPostsQueryDTO,
  GetPostQueryDTO,
  SavePostParamDTO,
  UpdatePostDTO,
} from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { PostRepo } from '../repositories/postRepo';

@Injectable()
export class PostService {
  private readonly logger = new Logger(`Micro-User.${PostService.name}`);
  constructor(private readonly postRepo: PostRepo) {}

  async createPost(data: CreatePostDTO) {
    this.logger.log(`${this.createPost.name} called Data:${JSON.stringify(data)}`);
    await this.postRepo.createOrUpdate(data);
    return { message: 'Tạo bài viết thành công', status: 201 };
  }

  async getPosts(query: GetPostQueryDTO) {
    this.logger.log(`${this.getPosts.name} called Data:${JSON.stringify(query)}`);
    return await this.postRepo.findAndCount(query);
  }

  async getPost(postId: number) {
    this.logger.log(`${this.getPosts.name} called postId:${postId}`);
    return await this.postRepo.getPost(postId);
  }

  async getMyPosts(query: GetMyPostsQueryDTO) {
    this.logger.log(`${this.getMyPosts.name} called Data:${JSON.stringify(query)}`);
    return await this.postRepo.findAndCount(query);
  }

  async updatePost(data: UpdatePostDTO) {
    this.logger.log(`${this.updatePost.name} called Data:${JSON.stringify(data)}`);
    await this.postRepo.updatePost(data);
    return { message: 'Cập nhật bài viết thành công', status: 200 };
  }

  async deletePost(data: DeletePostDTO) {
    this.logger.log(`${this.deletePost.name} called Data:${JSON.stringify(data)}`);
    await this.postRepo.deletePost(data);
    return { message: 'Xoá bài viết thành công', status: 200 };
  }

  async userSavePost(data: SavePostParamDTO) {
    this.logger.log(`${this.userSavePost.name} called Data:${JSON.stringify(data)}`);
    return await this.postRepo.userSavePost(data);
  }

  async getSavePost(userId: number) {
    this.logger.log(`${this.getSavePost.name} called userId:${userId}`);
    return await this.postRepo.getSavePost(userId);
  }
}
