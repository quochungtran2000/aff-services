import { MyProfileResponse, ProductCommentResponseDTO } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserService } from '../../services/user/user.service';

@ApiTags('Người dùng')
@Controller('mobile/user')
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
    } finally {
      this.logger.log(`${this.getSaveProducts.name} Done`);
    }
  }
}
