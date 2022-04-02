import { PERMISSION, ROLE, ROLE_PERMISSION } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AccessControlRepo {
  private readonly logger = new Logger(`Micro-User.${AccessControlRepo.name}`);

  constructor(
    @Inject('ROLE_REPOSITORY') private readonly roleRepo: Repository<ROLE>,
    @Inject('ROLE_PERMISSION_REPOSITORY') private readonly rolePermissionRepo: Repository<ROLE_PERMISSION>,
    @Inject('PERMISSION_REPOSITORY') private readonly permissionRepo: Repository<PERMISSION>
  ) {}

  async findOneRoleBySlug(slug: string) {
    return await this.roleRepo.createQueryBuilder('r').where('r.slug = :slug').setParameters({ slug }).getOne();
  }
}
