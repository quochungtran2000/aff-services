import { MyProfileResponse } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserService } from '../../services/user/user.service';

@Controller('website/user')
export class UserController {
  private readonly logger = new Logger(`Api-Gateway.${UserController.name}`);
  constructor(private readonly userService: UserService) {}

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
