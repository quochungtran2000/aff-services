import {
  BaseResponse,
  CreatePostDTO,
  DeletePostDTO,
  GetMyPostsQueryDTO,
  GetPostQueryDTO,
  PagingPostReponseDTO,
  PostResponseDTO,
  SavePostParamDTO,
  UpdatePostDTO,
} from '@aff-services/shared/models/dtos';
import { POST, USER_SAVE_POST } from '@aff-services/shared/models/entities';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepo {
  private readonly logger = new Logger(`Micro-User.${PostRepo.name}`);
  constructor(
    @Inject('POST_REPOSITORY') private readonly postRepository: Repository<POST>,
    @Inject('USER_SAVE_POST_REPOSITORY') private readonly userSavePostRepository: Repository<USER_SAVE_POST>
  ) {}

  async createOrUpdate(data: CreatePostDTO | CreatePostDTO[] | UpdatePostDTO) {
    try {
      this.logger.log(`${this.createOrUpdate.name} called Data:${JSON.stringify(data)}`);

      return await this.postRepository
        .createQueryBuilder()
        .insert()
        .into(POST)
        .values(data)
        .orUpdate(['post_title', 'post_thumbnail', 'post_type', 'post_content', 'updated_at'], ['post_id'])
        .execute();
    } catch (error) {
      this.logger.error(`${this.createOrUpdate.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.createOrUpdate.name} Done`);
    }
  }

  async findAndCount(query: GetPostQueryDTO | GetMyPostsQueryDTO): Promise<PagingPostReponseDTO> {
    try {
      this.logger.log(`${this.findAndCount.name} called Data:${JSON.stringify(query)}`);
      const { pageSize, skip, authorId, search, type } = query;
      const qr = this.postRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.author', 'au')
        .where('1=1')
        .andWhere('p.is_delete = false');

      if (authorId) qr.andWhere('au.user_id = :authorId');
      if (type) qr.andWhere('UPPER(p.post_type) = UPPER(:type)');

      const [data, total] = await qr
        .take(pageSize)
        .skip(skip)
        .setParameters({ pageSize, skip, authorId, search, type })
        .getManyAndCount();

      return { total, data: data?.map((element) => PostResponseDTO.fromEntity(element)) };
    } catch (error) {
      this.logger.error(`${this.findAndCount.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.findAndCount.name} Done`);
    }
  }

  async getOneById(id: number): Promise<PostResponseDTO> {
    try {
      this.logger.log(`${this.getOneById.name} called Id:${id}`);

      const result = await this.postRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.author', 'au')
        .where('1=1')
        .andWhere('p.post_id = :id')
        .andWhere('p.is_delete = false')
        .setParameters({ id })
        .getOneOrFail();

      return PostResponseDTO.fromEntity(result);
    } catch (error) {
      this.logger.error(`${this.getOneById.name} Error:${error.message}`);
      throw new RpcException({ message: 'Không tìm thấy bài viết', status: error.status || 500 });
    } finally {
      this.logger.log(`${this.getOneById.name} Done`);
    }
  }

  async getPost(postId: number) {
    try {
      this.logger.log(`${this.getPost.name} called`);
      const exists = await this.getOneById(postId);
      await this.updateTotalViewById(postId);
      return exists;
    } catch (error) {
      this.logger.error(`${this.getPost.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.getPost.name} Done`);
    }
  }

  async deleteById(id: number) {
    try {
      this.logger.log(`${this.deleteById.name} called Id:${id}`);
      return await this.postRepository
        .createQueryBuilder('')
        .update(POST)
        .set({ isDelete: true })
        .where('post_id = :id')
        .setParameters({ id })
        .execute();
    } catch (error) {
      this.logger.error(`${this.deleteById.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.deleteById.name} Done`);
    }
  }

  async updateTotalViewById(id) {
    try {
      this.logger.log(`${this.updateTotalViewById.name} called Id:${id}`);
      return await this.postRepository
        .createQueryBuilder('')
        .update(POST)
        .set({ totalView: () => 'total_view + 1' })
        .where('post_id = :id')
        .setParameters({ id })
        .execute();
    } catch (error) {
      this.logger.error(`${this.updateTotalViewById.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.updateTotalViewById.name} Done`);
    }
  }

  async updatePost(data: UpdatePostDTO) {
    try {
      const { postId, postAuthor, ...toBeUpdate } = data;
      this.logger.log(`${this.updatePost.name} data:${JSON.stringify(data)}`);
      const exists = await this.getOneById(postId);
      if (exists.author.userId !== postAuthor)
        throw new BadRequestException('Bạn không có quyền chỉnh sửa bài viết này');

      return await this.postRepository
        .createQueryBuilder('')
        .update(POST)
        .set(toBeUpdate)
        .where('post_id = :postId')
        .setParameters({ postId })
        .execute();
    } catch (error) {
      this.logger.error(`${this.updatePost.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.updatePost.name} Done`);
    }
  }

  async deletePost(data: DeletePostDTO) {
    try {
      const { postId, postAuthor } = data;
      this.logger.log(`${this.deletePost.name} data:${JSON.stringify(data)}`);
      const exists = await this.getOneById(postId);
      if (exists.author.userId !== postAuthor)
        throw new BadRequestException('Bạn không có quyền chỉnh sửa bài viết này');

      return await this.deleteById(postId);
    } catch (error) {
      this.logger.error(`${this.deletePost.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.deletePost.name} Done`);
    }
  }

  async userSavePost(data: SavePostParamDTO): Promise<BaseResponse> {
    try {
      const { postId, userId } = data;
      let insert = true;
      const exists = await this.userSavePostRepository
        .createQueryBuilder()
        .where('1=1')
        .andWhere('post_id = :postId')
        .andWhere('user_id = :userId')
        .setParameters({ postId, userId })
        .getOne();

      if (exists) {
        insert = false;
        await this.userSavePostRepository
          .createQueryBuilder()
          .delete()
          .from(USER_SAVE_POST)
          .where('user_id = :userId')
          .andWhere('post_id = :postId')
          .setParameters({ userId, postId })
          .execute();
      } else {
        await this.userSavePostRepository
          .createQueryBuilder()
          .insert()
          .into(USER_SAVE_POST)
          .values({ postId, userId })
          .execute();
      }
      return { message: `${insert ? 'lưu' : 'xóa'} thành công`, status: 200 };
    } catch (error) {
      this.logger.error(`${this.userSavePost.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.userSavePost.name} Done`);
    }
  }

  async getSavePost(userId: number) {
    try {
      this.logger.log(`${this.getSavePost.name} called userId:${userId}`);
      const [data, total] = await this.postRepository
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.author', 'au')
        .leftJoin('p.savePosts', 'sp')
        .where('1=1')
        .andWhere('sp.user_id = :userId')
        .setParameters({ userId })
        .getManyAndCount();
      return { total, data: data?.map((element) => PostResponseDTO.fromEntity(element)) };
    } catch (error) {
      this.logger.error(`${this.getSavePost.name} Error:${error.message}`);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    } finally {
      this.logger.log(`${this.getSavePost.name} Done`);
    }
  }
}
