import {Injectable, Logger} from "@nestjs/common";
import {UserRepo} from "../repositories/userRepo";
import {UpdateResult} from "typeorm";

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(`Micro-User.${ProfileService.name}`);

  constructor(private readonly userRepo : UserRepo) {}

  async updateUser(data: { userId: number, fullname: string, email: string, phoneNumber: string, imgURL: string }) : Promise<UpdateResult>{
    this.logger.log(`${this.updateUser.name} called`)
    return await this.userRepo.updateUser(data)
  }
}
