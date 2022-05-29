import {Controller, Logger} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import { CMD } from '@aff-services/shared/utils/helpers';
import {ProfileService} from "./profile.service";
import {UpdateResult} from "typeorm";
import {ProfileUpdateRequest} from "@aff-services/shared/models/dtos";

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(`Micro-User.${ProfileController.name}`);
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: CMD.USER_UPDATE_PROFILE})
  updateUser(data: ProfileUpdateRequest) : Promise<UpdateResult> {
    this.logger.log(`${this.updateUser.name} called`);
    return this.profileService.updateUser(data);
  }
}
