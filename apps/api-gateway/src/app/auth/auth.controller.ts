import {
  BaseResponse,
  LoginPayload,
  LoginResponse,
  MyProfileResponse,
  RegisterPayload,
} from '@aff-services/shared/models/dtos';
import { Body, Controller, Get, HttpException, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private logger = new Logger(`Api-Gateway.${AuthController.name}`);
  constructor(private readonly AuthService: AuthService) {}

  @ApiResponse({ status: 200, type: LoginResponse })
  @Post('login')
  async login(@Body() data: LoginPayload, @Res() res: Response) {
    try {
      this.logger.log(`${this.login.name} called`);
      const result = await this.AuthService.login(data);
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.login.name} Error:${error.message}`);
      // throw new HttpException(error.status, error.message);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiResponse({ status: 200, type: MyProfileResponse })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const profile = Object.assign({}, req.user as MyProfileResponse);
    return res.status(200).json(profile);
  }

  @ApiResponse({ type: BaseResponse, status: 201 })
  @Post('register')
  async register(@Body() data: RegisterPayload, @Res() res: Response) {
    try {
      this.logger.log(`${this.register.name} called`);
      const result = await this.AuthService.register(RegisterPayload.from(data));
      return res.status(201).json(result);
    } catch (error) {
      this.logger.error(`${this.register.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
