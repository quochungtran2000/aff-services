import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { userProviders } from '../providers/user.providers';
import { UserRepo } from '../repositories/userRepo';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserRepo, ...userProviders],
})
export class UserModule {}
