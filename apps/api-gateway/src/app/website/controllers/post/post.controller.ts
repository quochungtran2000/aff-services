import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { PostService } from '../../services/post/post.service';
import { Request, Response } from 'express';
import {
  BaseResponse,
  CreatePostDTO,
  DeletePostDTO,
  GetMyPostsQueryDTO,
  GetPostDetailDTO,
  GetPostQueryDTO,
  MyProfileResponse,
  PagingPostReponseDTO,
  PostResponseDTO,
  SavePostParamDTO,
  UpdatePostDTO,
} from '@aff-services/shared/models/dtos';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

@ApiTags('Bài viết')
@Controller('website/post')
export class PostController {
  private readonly logger = new Logger(`Api-Gateway.${PostController.name}`);
  constructor(private readonly postService: PostService) {}

  @Post('')
  @ApiResponse({ status: 201, type: BaseResponse })
  @ApiOperation({ summary: 'Đăng bài viết' })
  @UseGuards(JwtAuthGuard)
  async createPost(@Res() res: Response, @Req() req: Request, @Body() data: CreatePostDTO) {
    try {
      this.logger.log(`${this.createPost.name} called`);
      data.postAuthor = (req.user as MyProfileResponse).userId;
      const result = await this.postService.createPost(CreatePostDTO.from(data));
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('')
  @ApiResponse({ status: 200, type: PagingPostReponseDTO })
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  async getPosts(@Res() res: Response, @Req() req: Request, @Query() query: GetPostQueryDTO) {
    try {
      this.logger.log(`${this.getPosts.name} called`);
      const result = await this.postService.getPosts(GetPostQueryDTO.from(query));
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('/detail/:postId')
  @ApiResponse({ status: 200, type: PostResponseDTO })
  @ApiOperation({ summary: 'Lấy chi tiết bài viết' })
  async getPost(@Res() res: Response, @Req() req: Request, @Param() param: GetPostDetailDTO) {
    try {
      this.logger.log(`${this.getPost.name} called`);
      const result = await this.postService.getPost(param.postId);
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Get('/my-posts')
  @ApiResponse({ status: 200, type: PagingPostReponseDTO })
  @ApiOperation({ summary: 'Bài viết của tôi' })
  @UseGuards(JwtAuthGuard)
  async getMyPosts(@Res() res: Response, @Req() req: Request, @Query() query: GetMyPostsQueryDTO) {
    try {
      this.logger.log(`${this.getPosts.name} called`);
      query.authorId = (req.user as MyProfileResponse).userId;
      const result = await this.postService.getMyPosts(GetMyPostsQueryDTO.from(query));
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Put('')
  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  @UseGuards(JwtAuthGuard)
  async updatePost(@Res() @Res() res: Response, @Req() req: Request, @Body() data: UpdatePostDTO) {
    try {
      this.logger.log(`${this.updatePost.name} called`);
      data.postAuthor = (req.user as MyProfileResponse).userId;
      const result = await this.postService.updatePost(UpdatePostDTO.from(data));
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @Delete('/:postId')
  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiOperation({ summary: 'Xóa bài viết' })
  @UseGuards(JwtAuthGuard)
  async deletePost(@Res() res: Response, @Req() req: Request, @Param() data: DeletePostDTO) {
    try {
      this.logger.log(`${this.deletePost.name} called`);
      data.postAuthor = (req.user as MyProfileResponse).userId;
      const result = await this.postService.deletePost(DeletePostDTO.from(data));
      return res.status(201).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Lưu bài viết để xem sau' })
  @UseGuards(JwtAuthGuard)
  @Post('/save/:postId')
  async userSavePost(@Res() res: Response, @Req() req: Request, @Param() data: SavePostParamDTO) {
    try {
      this.logger.log(`${this.userSavePost.name} called`);
      data.userId = (req.user as MyProfileResponse).userId;
      const result = await this.postService.userSavePost(SavePostParamDTO.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.userSavePost.name} Done`);
    }
  }

  @ApiOperation({ summary: 'Danh sách bài viết đã lưu' })
  @UseGuards(JwtAuthGuard)
  @Get('/save-post')
  async getSavePosts(@Res() res: Response, @Req() req: Request) {
    try {
      this.logger.log(`${this.getSavePosts.name} called`);
      const userId = (req.user as MyProfileResponse).userId;
      const result = await this.postService.getSavePosts(userId);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.getSavePosts.name} Done`);
    }
  }
}
