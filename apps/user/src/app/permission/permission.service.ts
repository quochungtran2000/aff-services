import { PagingPermissionResponse } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { AccessControlRepo } from '../repositories/accessControlRepo';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(`Micro-User.${PermissionService.name}`);
  constructor(private readonly accessControlRepo: AccessControlRepo) {}

  async getPermissions(): Promise<PagingPermissionResponse> {
    this.logger.log(`${this.getPermissions.name}`);
    return await this.accessControlRepo.getManyAndCountPermissions();
  }
}
