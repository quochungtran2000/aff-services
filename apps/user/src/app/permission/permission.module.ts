import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AccessControlProviders } from '../providers/accessControl.providers';
import { AccessControlRepo } from '../repositories/accessControlRepo';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PermissionController],
  providers: [PermissionService, AccessControlRepo, ...AccessControlProviders],
})
export class PermissionModule {}
