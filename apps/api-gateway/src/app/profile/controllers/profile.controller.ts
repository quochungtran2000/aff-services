import {
  Body,
  Controller,
  HttpException,
  Logger,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ProfileUpdateRequest, ProfileUpdateResponse} from "@aff-services/shared/models/dtos";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express, Response} from "express";
import 'multer';
import {ProfileService} from "../services/profile.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {SwaggerNoAuthException, SwaggerNoAuthHeaders} from "@aff-services/shared/common/swagger";

@ApiTags('Image')
@UseGuards(JwtAuthGuard)
@Controller('/profile')
export class ProfileController {
  private readonly logger = new Logger(`API-Gateway.${ProfileController.name}`);
  private
  constructor(private readonly profileService : ProfileService) {}


  @ApiResponse({ type: ProfileUpdateRequest })
  @SwaggerNoAuthException()
  @SwaggerNoAuthHeaders()
  @Put("/update")
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(@UploadedFile() file: Express.Multer.File, @Body() data: ProfileUpdateRequest, @Res() res: Response) {
    try {
      this.logger.log(`${this.updateUserProfile.name} called`)
      const result = await this.profileService.updateUserProfile(file, data);
      return res.status(200).json(result);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
