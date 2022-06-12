import { MyProfileResponse, ProductCommentResponseDTO, UpdateUserDTO } from '@aff-services/shared/models/dtos';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserService } from '../../services/user/user.service';

@ApiTags('Người dùng')
@Controller('website/user')
export class UserController {
  private readonly logger = new Logger(`Api-Gateway.${UserController.name}`);
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Lấy danh sách sản phẩm người dùng đã lưu' })
  @ApiResponse({ status: 200, type: ProductCommentResponseDTO, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get('save-product')
  async getSaveProducts(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.getSaveProducts.name} called`);
      const userId = (req.user as MyProfileResponse).userId;
      const result = await this.userService.getSaveProducts(userId);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    } 
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    this.logger.log(`${this.uploadFile.name} called`);
    return await this.userService.uploadFile(file);
  }

  @ApiOperation({ summary: 'Dùng để cập nhật thông tin user' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async updateUser(@Req() req: Request, @Res() res: Response, @Body() data: UpdateUserDTO) {
    try {
      this.logger.log(`${this.updateUser.name} called`);
      data.userId = (req.user as MyProfileResponse).userId;
      const result = await this.userService.updateUser(UpdateUserDTO.from(data));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
