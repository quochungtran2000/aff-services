import { Module } from '@nestjs/common';
import {DatabaseModule} from "../../database/database.module";
import {JwtModule} from "@nestjs/jwt";
import {config} from "../../config/configurations";
import {ProfileService} from "./profile.service";
import {ProfileController} from "./profile.controller";

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '1y' },
    })
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
