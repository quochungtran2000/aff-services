import { Controller, Get, HttpException, Logger, Param, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CommentService } from '../../services/comment/comment.service';

// @SwaggerHeaders()
@ApiTags('Bình luận')
@Controller('mobile/comment')
export class CommentController {
  private readonly logger = new Logger(`Api-Gateway.${CommentController.name}`);
  constructor(private readonly commentService: CommentService) {}

  @Get('ecommerce-product/:productId')
  async mobileGetEcommerceProductComment(
    @Req() req: Request,
    @Res() res: Response,
    @Param('productId') productId: string
  ) {
    try {
      this.logger.log(`${this.mobileGetEcommerceProductComment.name} called`);
      const result = await this.commentService.getEcommerceProductComment(productId);
      return res.status(200).json(result);
    } catch (error) {
      this.logger.log(`${this.mobileGetEcommerceProductComment.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    } finally {
      this.logger.log(`${this.mobileGetEcommerceProductComment.name} Done`);
    }
  }
}
