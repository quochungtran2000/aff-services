import { Body, Controller, Get, HttpException, Logger, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { BcryptService } from '@aff-services/shared/common/services';
import {
  BaseResponse,
  ChangePasswordPayload,
  CheckRequestResetPasswordResponse,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  MyProfileResponse,
  RegisterPayload,
  RequestResetPasswordQuery,
  ResetPasswordPayload,
} from '@aff-services/shared/models/dtos';
import {
  SwaggerException,
  SwaggerHeaders,
  SwaggerNoAuthException,
  SwaggerNoAuthHeaders,
} from '@aff-services/shared/common/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private logger = new Logger(`Api-Gateway.${AuthController.name}`);
  private readonly bcryptService = new BcryptService();
  constructor(private readonly AuthService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập' })
  @SwaggerNoAuthException()
  @SwaggerNoAuthHeaders()
  @ApiResponse({ status: 200, type: LoginResponse })
  @Post('login')
  async login(@Body() data: LoginPayload, @Res() res: Response) {
    try {
      this.logger.log(`${this.login.name} called`);
      const result = await this.AuthService.login(LoginPayload.from(data));
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.login.name} Error:${error.message}`);
      // throw new HttpException(error.status, error.message);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Thông tin của tôi' })
  @SwaggerHeaders()
  @SwaggerException()
  @ApiResponse({ status: 200, type: MyProfileResponse })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const profile = Object.assign({}, req.user as MyProfileResponse);
    return res.status(200).json(profile);
  }

  @ApiOperation({ summary: 'Đăng ký' })
  @SwaggerNoAuthHeaders()
  @SwaggerNoAuthException()
  @ApiResponse({ type: BaseResponse, status: 201 })
  @Post('register')
  async register(@Body() data: RegisterPayload, @Res() res: Response) {
    try {
      this.logger.log(`${this.register.name} called`);
      data['password'] = await this.bcryptService.hashPassword(data['password']);
      const result = await this.AuthService.register(RegisterPayload.from(data));
      return res.status(201).json(result);
    } catch (error) {
      this.logger.error(`${this.register.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @UseGuards(JwtAuthGuard)
  @SwaggerNoAuthHeaders()
  @SwaggerNoAuthException()
  @Post('password')
  async changePassword(@Body() data: ChangePasswordPayload, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.changePassword.name} called`);
      data['userId'] = (req.user as MyProfileResponse).userId;
      const result = await this.AuthService.changePassword(ChangePasswordPayload.from(data));
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.changePassword.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Quên mật khẩu' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordPayload, @Res() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`${this.forgotPassword.name} called`);
      const result = await this.AuthService.forgotPassword(ForgotPasswordPayload.from(data));
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.forgotPassword.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Kiểm tra đường dẫn đặt lại mật khẩu có hợp lệ hay không' })
  @ApiResponse({ type: CheckRequestResetPasswordResponse })
  @Get('reset-password')
  async checkRequestResetPassword(
    @Res() req: Request,
    @Res() res: Response,
    @Query() query: RequestResetPasswordQuery
  ) {
    try {
      this.logger.log(`${this.checkRequestResetPassword.name} called`);
      const result = await this.AuthService.checkRequestResetPassword(RequestResetPasswordQuery.from(query));
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.checkRequestResetPassword.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }

  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({ type: BaseResponse })
  @Post('reset-password')
  async resetPassword(
    @Res() req: Request,
    @Res() res: Response,
    @Query() query: RequestResetPasswordQuery,
    @Body() data: ResetPasswordPayload
  ) {
    try {
      this.logger.log(`${this.resetPassword.name} called`);
      const result = await this.AuthService.resetPassword(ResetPasswordPayload.from(query, data));
      return res.status(200).json(result);
    } catch (error) {
      this.logger.error(`${this.changePassword.name} Error:${error.message}`);
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
