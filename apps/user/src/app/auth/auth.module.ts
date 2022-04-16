import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config/configurations';
import { DatabaseModule } from '../../database/database.module';
import { AccessControlProviders } from '../providers/accessControl.providers';
import { userProviders } from '../providers/user.providers';
import { AccessControlRepo } from '../repositories/accessControlRepo';
import { UserRepo } from '../repositories/userRepo';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepo, AccessControlRepo, ...userProviders, ...AccessControlProviders],
})
export class AuthModule {}
