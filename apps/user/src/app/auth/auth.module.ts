import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../config/configurations';
import { DatabaseModule } from '../../database/database.module';
import { userProviders } from '../providers/user.providers';
import { UserRepo } from '../repositories/userRepo';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepo, ...userProviders],
})
export class AuthModule {}
