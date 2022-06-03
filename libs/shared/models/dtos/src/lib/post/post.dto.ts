import { POST, POST_COMMENT } from '@aff-services/shared/models/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { UserResponse } from '../user';

export class CreatePostDTO {
  @ApiProperty({ type: String, example: '5 thiết bị cần mua để tiết kiệm 1 khoản khi đi du lịch' })
  @IsNotEmpty()
  postTitle: string;

  @ApiProperty({
    type: String,
    example: 'https://cybershow.vn/wp-content/uploads/2019/04/team-building-da-nang-2-480x360.jpg',
  })
  @IsNotEmpty()
  postThumbnail: string;

  @ApiProperty({
    type: String,
    example:
      'Sau đây là 5 thiết bị cần mua trước khi đi du lịch để tiết kiệm được một khoảng chi phí rất lớn khi đi du lịch ở Vịnh Hạ Long. Thứ nhất nên mua kính râm, nón rơm trước ở nhà để tối ưu chi phí,...',
  })
  @IsNotEmpty()
  postContent: string;

  @ApiProperty({ type: String, example: 'tips' })
  @IsNotEmpty()
  postType: string;

  postAuthor: number;
  createdAt: Date;
  updatedAt: Date;

  public static from(dto: Partial<CreatePostDTO>) {
    const result = new CreatePostDTO();
    result.postTitle = dto.postTitle;
    result.postThumbnail = dto.postThumbnail;
    result.postContent = dto.postContent;
    result.postType = dto.postType;
    result.postAuthor = dto.postAuthor;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    return result;
  }
}

export class UpdatePostDTO {
  @ApiProperty({ type: String, example: 1 })
  @IsNotEmpty()
  postId: number;

  @ApiProperty({ type: String, example: '5 thiết bị cần mua để tiết kiệm 1 khoản khi đi du lịch' })
  @IsNotEmpty()
  postTitle: string;

  @ApiProperty({
    type: String,
    example: 'https://cybershow.vn/wp-content/uploads/2019/04/team-building-da-nang-2-480x360.jpg',
  })
  @IsNotEmpty()
  postThumbnail: string;

  @ApiProperty({
    type: String,
    example:
      'Sau đây là 5 thiết bị cần mua trước khi đi du lịch để tiết kiệm được một khoảng chi phí rất lớn khi đi du lịch ở Vịnh Hạ Long. Thứ nhất nên mua kính râm, nón rơm trước ở nhà để tối ưu chi phí,...',
  })
  @IsNotEmpty()
  postContent: string;

  @ApiProperty({ type: String, example: 'tips' })
  @IsNotEmpty()
  postType: string;

  postAuthor: number;
  createdAt: Date;
  updatedAt: Date;

  public static from(dto: Partial<UpdatePostDTO>) {
    const result = new UpdatePostDTO();
    result.postId = dto.postId;
    result.postTitle = dto.postTitle;
    result.postThumbnail = dto.postThumbnail;
    result.postContent = dto.postContent;
    result.postType = dto.postType;
    result.postAuthor = dto.postAuthor;
    result.createdAt = new Date();
    result.updatedAt = new Date();
    return result;
  }
}

export class DeletePostDTO {
  @ApiProperty({ type: String, example: 1 })
  @IsNotEmpty()
  postId: number;

  postAuthor: number;

  public static from(dto: Partial<DeletePostDTO>) {
    const result = new DeletePostDTO();
    result.postId = dto.postId;
    result.postAuthor = dto.postAuthor;
    return result;
  }
}

export class GetPostQueryDTO {
  @ApiProperty({ type: Number, example: 1, required: false })
  page: number;

  @ApiProperty({ type: Number, example: 12, required: false })
  pageSize: number;

  @ApiProperty({ type: Number, example: 1313, required: false })
  authorId: number;

  @ApiProperty({ type: String, example: 'Tìm kiếm', required: false })
  search: string;

  @ApiProperty({ type: String, example: 'tips', required: false })
  type: string;

  skip: number;

  public static from(dto: Partial<GetPostQueryDTO>) {
    const result = new GetPostQueryDTO();
    result.page = dto.page || 1;
    result.pageSize = dto.pageSize || 12;
    result.skip = (dto.page - 1) * result.pageSize;
    result.authorId = dto.authorId;
    result.type = dto.type;
    result.search = dto.search;
    return result;
  }
}

export class GetMyPostsQueryDTO {
  @ApiProperty({ type: Number, example: 1, required: false })
  page: number;

  @ApiProperty({ type: Number, example: 12, required: false })
  pageSize: number;

  @ApiProperty({ type: String, example: 'Tìm kiếm', required: false })
  search: string;

  @ApiProperty({ type: String, example: 'tips', required: false })
  type: string;

  authorId: number;
  skip: number;

  public static from(dto: Partial<GetMyPostsQueryDTO>) {
    const result = new GetMyPostsQueryDTO();
    result.page = dto.page || 1;
    result.pageSize = dto.pageSize || 12;
    result.skip = (result.page - 1) * result.pageSize;
    result.authorId = dto.authorId;
    result.type = dto.type;
    result.search = dto.search;
    return result;
  }
}

export class GetPostDetailDTO {
  @ApiProperty({ type: Number, example: 32, required: true })
  @IsNumberString()
  postId: number;
}

export class PostResponseDTO {
  @ApiProperty({ type: Number, example: 32 })
  postId: number;

  @ApiProperty({ type: String, example: '5 thiết bị cần mua để tiết kiệm 1 khoản khi đi du lịch' })
  postTitle: string;

  @ApiProperty({
    type: String,
    example: 'https://cybershow.vn/wp-content/uploads/2019/04/team-building-da-nang-2-480x360.jpg',
  })
  postThumbnail: string;

  @ApiProperty({ type: String, example: 'tips' })
  postType: string;

  @ApiProperty({
    type: String,
    example:
      'Sau đây là 5 thiết bị cần mua trước khi đi du lịch để tiết kiệm được một khoảng chi phí rất lớn khi đi du lịch ở Vịnh Hạ Long. Thứ nhất nên mua kính râm, nón rơm trước ở nhà để tối ưu chi phí,...',
  })
  postContent: string;

  @ApiProperty({ type: UserResponse })
  author: UserResponse;

  @ApiProperty({ type: Number, example: 1 })
  totalView: number;

  @ApiProperty({ type: Date, example: new Date() })
  createdAt: Date;

  @ApiProperty({ type: Date, example: new Date() })
  updatedAt: Date;

  public static fromEntity(entity: Partial<POST>) {
    const result = new PostResponseDTO();
    result.postId = entity.postId;
    result.postTitle = entity.postTitle;
    result.postThumbnail = entity.postThumbnail;
    result.postType = entity.postType;
    result.postContent = entity.postContent;
    if (entity?.author) result.author = UserResponse.fromEntity(entity.author);
    result.totalView = entity.totalView;
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    return result;
  }
}

export class PagingPostReponseDTO {
  @ApiProperty({ type: Number, example: 1 })
  total: number;

  @ApiProperty({ type: PostResponseDTO, isArray: true })
  data: PostResponseDTO[];
}

export class SavePostParamDTO {
  @ApiProperty({ type: Number, example: 699 })
  postId: number;

  userId: number;

  public static from(dto: Partial<SavePostParamDTO>) {
    const result = new SavePostParamDTO();
    result.postId = dto.postId;
    result.userId = dto.userId;
    return result;
  }
}

export class CommentPostDTO {
  @ApiProperty({ type: Number, example: 699 })
  @IsNotEmpty()
  postId: number;

  @ApiProperty({ type: Number, example: 'example' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Number, example: 699 })
  parentId?: number;

  @ApiProperty({ type: Number, example: 699 })
  images: string[];

  userId: number;

  public static from(dto: Partial<CommentPostDTO>) {
    const result = new CommentPostDTO();
    result.postId = dto.postId;
    result.content = dto.content;
    result.parentId = dto.parentId;
    result.userId = dto.userId;
    return result;
  }

  // public static from
}

export class CommentResponseDTO {
  @ApiProperty({ type: Number, example: 699 })
  postCommentId: number;

  @ApiProperty({ type: Number, example: 699 })
  content: string;

  @ApiProperty({ type: String, example: [], isArray: true })
  images: string[];

  @ApiProperty({
    type: CommentResponseDTO,
    example: [
      {
        postCommentId: 1,
        content: 'Hay qua',
        images: [],
        createdAt: '2022-06-03T02:03:10.521Z',
        updatedAt: '2022-06-03T02:03:10.521Z',
        customer: {
          userId: 18,
          username: 'hungc',
          fullname: 'Trần Quốc Hùng',
          email: 'hungc@dxc.com',
          phoneNumber: '0918266812',
          roleId: 3,
          createdAt: '2022-04-02T08:33:47.659Z',
          updatedAt: '2022-04-02T08:33:47.659Z',
        },
        childrens: [],
      },
    ],
    isArray: true,
  })
  childrens: CommentResponseDTO[];

  @ApiProperty({ type: Number, example: new Date() })
  createdAt: Date;

  @ApiProperty({ type: Number, example: new Date() })
  updatedAt: Date;

  @ApiProperty({ type: UserResponse })
  customer?: UserResponse;

  public static fromEntity(entity: Partial<POST_COMMENT>) {
    const result = new CommentResponseDTO();
    result.postCommentId = entity.postCommentId;
    result.content = entity.content;
    result.images = [];
    result.createdAt = entity.createdAt;
    result.updatedAt = entity.updatedAt;
    if (entity.customer) result.customer = UserResponse.fromEntity(entity.customer);
    result.childrens = [];
    if (entity.childrens) entity.childrens.map((elm) => result.childrens.push(this.fromEntity(elm)));
    return result;
  }
}

export class PagingPostCommentReponseDTO {
  @ApiProperty({ type: Number, example: 1 })
  total: number;

  @ApiProperty({ type: CommentResponseDTO, isArray: true })
  data: CommentResponseDTO[];
}
