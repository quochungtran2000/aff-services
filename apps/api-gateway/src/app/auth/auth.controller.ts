import { LoginPayload, MyProfileResponse } from '@aff-services/shared/models/dtos';
import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger(`Api-Gateway.${AuthController.name}`);
  constructor(private readonly AuthService: AuthService) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request, @Res() res: Response) {
    const profile = Object.assign({}, req.user as MyProfileResponse);
    return res.status(200).json(profile);
  }
}
