import { HttpModule, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { configProviders } from '../providers/config.providers';
import { userProviders } from '../providers/user.providers';
import { ConfigRepo } from '../repositories/configRepo';
import { UserRepo } from '../repositories/userRepo';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepo, ...userProviders, ConfigRepo, ...configProviders],
})
export class UserModule {}
