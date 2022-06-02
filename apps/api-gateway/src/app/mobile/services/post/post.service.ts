import { BaseResponse, CreatePostDTO, DeletePostDTO, GetMyPostsQueryDTO, GetPostQueryDTO, UpdatePostDTO } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${UserService.name}`);
  constructor() {
    this.logger.log(`Connecting to: ${process.env.REDIS_URL}`);
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL,
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }

  async createPost(data: CreatePostDTO) {
    this.logger.log(`${this.createPost.name} called`);
    return await this.client.send<BaseResponse>({ cmd: CMD.CREATE_POST }, data).toPromise();
  }

  async getPosts(query: GetPostQueryDTO) {
    this.logger.log(`${this.getPosts.name} called`);
    return this.client.send<any>({ cmd: CMD.GET_POSTS }, query).toPromise();
  }

  async getPost(postId: number) {
    this.logger.log(`${this.getPost.name} called`);
    return this.client.send<any>({ cmd: CMD.GET_POST }, { postId }).toPromise();
  }

  async getMyPosts(query: GetMyPostsQueryDTO) {
    this.logger.log(`${this.getMyPosts.name} called`);
    return this.client.send<any>({ cmd: CMD.GET_MY_POSTS }, query).toPromise();
  }

  async updatePost(data: UpdatePostDTO) {
    this.logger.log(`${this.updatePost.name} called`);
    return this.client.send<BaseResponse>({ cmd: CMD.UPDATE_POST }, data).toPromise();
  }

  async deletePost(data: DeletePostDTO) {
    this.logger.log(`${this.deletePost.name} called`);
    return this.client.send<BaseResponse>({ cmd: CMD.DELETE_POST }, data).toPromise();
  }
}
