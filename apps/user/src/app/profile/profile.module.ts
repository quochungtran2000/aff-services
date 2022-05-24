import { Module } from '@nestjs/common';
import {DatabaseModule} from "../../database/database.module";
import {JwtModule} from "@nestjs/jwt";
import {config} from "../../config/configurations";
import {ProfileService} from "./profile.service";
import {ProfileController} from "./profile.controller";
import {UserRepo} from "../repositories/userRepo";
import {userProviders} from "../providers/user.providers";

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '1y' },
    })
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UserRepo, ...userProviders]
})
export class ProfileModule {}
