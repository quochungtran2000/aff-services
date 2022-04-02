import { UserQuery } from '@aff-services/shared/models/dtos';
import { Controller, Get, HttpException, Logger, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UserService } from '../../services/user/user.service';

@ApiTags('User Management')
@UseGuards(JwtAuthGuard)
@Controller('admin/user')
export class UserController {
  private readonly logger = new Logger(`Api-Gateway.${UserController.name}`);
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Res() res: Response, @Req() req: Request, @Query() query: UserQuery) {
    try {
      this.logger.log(`${this.getUsers.name} called`);
      const result = await this.userService.getUsers(UserQuery.from(query));
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
