import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { PermissionController } from './controllers/permission/permission.controller';
import { PermissionService } from './services/permission/permission.service';

@Module({
  imports: [],
  controllers: [AdminController, UserController, PermissionController],
  providers: [AdminService, UserService, PermissionService],
})
export class AdminModule {}
