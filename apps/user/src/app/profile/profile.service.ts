import {Injectable, Logger} from "@nestjs/common";
import {UserRepo} from "../repositories/userRepo";
import {UpdateResult} from "typeorm";
import {ProfileUpdateRequest} from "@aff-services/shared/models/dtos";

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(`Micro-User.${ProfileService.name}`);

  constructor(private readonly userRepo : UserRepo) {}

  async updateUser(data: ProfileUpdateRequest) : Promise<UpdateResult>{
    this.logger.log(`${this.updateUser.name} called`)
    return await this.userRepo.updateUser(data)
  }
}
