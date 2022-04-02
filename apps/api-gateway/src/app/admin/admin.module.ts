import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { AccessControlController } from './controllers/access-control/access-control.controller';
import { AccessControlService } from './services/access-control/access-control.service';

@Module({
  imports: [],
  controllers: [AdminController, UserController, AccessControlController],
  providers: [AdminService, UserService, AccessControlService],
})
export class AdminModule {}
