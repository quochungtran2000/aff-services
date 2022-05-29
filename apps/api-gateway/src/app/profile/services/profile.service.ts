import {Injectable, Logger} from "@nestjs/common";
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";
import {ProfileUpdateRequest} from "@aff-services/shared/models/dtos";
import {Express} from "express";
import {UpdateResult} from "typeorm";
import {CMD} from "@aff-services/shared/utils/helpers";

@Injectable()
export class ProfileService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.CloudinaryService.${ProfileService.name}`);
  constructor() {
    this.logger.log(`Connecting to: ${process.env.REDIS_URL}`);
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL,
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }

  async updateUserProfile(data: ProfileUpdateRequest) : Promise<UpdateResult>{
    return await this.client.send<UpdateResult>({ cmd: CMD.USER_UPDATE_PROFILE }, data).toPromise()
  }
}
