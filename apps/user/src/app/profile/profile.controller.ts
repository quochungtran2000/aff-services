import {Controller, Logger} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import { CMD } from '@aff-services/shared/utils/helpers';
import {ProfileService} from "./profile.service";
import {UpdateResult} from "typeorm";

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(`Micro-User.${ProfileController.name}`);
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: CMD.USER_UPDATE_PROFILE})
  updateUser(data: { userId: number, fullname: string, email: string, phoneNumber: string, imgURL: string }) : Promise<UpdateResult> {
    this.logger.log(`${this.updateUser.name} called`);
    return this.profileService.updateUser(data);
  }
}
