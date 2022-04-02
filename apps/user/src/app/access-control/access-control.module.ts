import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AccessControlProviders } from '../providers/accessControl.providers';
import { AccessControlRepo } from '../repositories/accessControlRepo';
import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AccessControlController],
  providers: [AccessControlService, AccessControlRepo, ...AccessControlProviders],
})
export class AccessControlModule {}
