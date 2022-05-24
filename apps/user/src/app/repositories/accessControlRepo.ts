import { PERMISSION, ROLE, ROLE_PERMISSION } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import {
  AssignPermissionDTO,
  BaseResponse,
  CreateRoleDTO,
  CreateRolePermissionDTO,
  PagingPermissionResponse,
  PagingRoleResponse,
  UpdateRoleDTO,
} from '@aff-services/shared/models/dtos';

@Injectable()
export class AccessControlRepo {
  private readonly logger = new Logger(`Micro-User.${AccessControlRepo.name}`);

  constructor(
    @Inject('ROLE_REPOSITORY') private readonly roleRepo: Repository<ROLE>,
    @Inject('ROLE_PERMISSION_REPOSITORY') private readonly rolePermissionRepo: Repository<ROLE_PERMISSION>,
    @Inject('PERMISSION_REPOSITORY') private readonly permissionRepo: Repository<PERMISSION>
  ) {}

  async findOneRoleBySlug(slug: string) {
    this.logger.log(`${this.findOneRoleBySlug.name} called with slug:${slug}`);
    return await this.roleRepo.createQueryBuilder('r').where('r.slug = :slug').setParameters({ slug }).getOne();
  }

  async getManyAndCountPermissions() {
    this.logger.log(`${this.getManyAndCountPermissions.name} called`);
    const [data, total] = await this.permissionRepo.createQueryBuilder('p').getManyAndCount();
    return PagingPermissionResponse.from(total, data);
  }

  async getManyAndCountRoles() {
    this.logger.log(`${this.getManyAndCountRoles.name} called`);
    const [data, total] = await this.roleRepo
      .createQueryBuilder('r')
      // .leftJoinAndSelect('r.rolePermissions', 'rp')
      // .leftJoinAndSelect('rp.permission', 'p')
      .getManyAndCount();
    return PagingRoleResponse.from(total, data);
  }

  async createRole(data: CreateRoleDTO): Promise<BaseResponse> {
    try {
      this.logger.log(`${this.createRole.name} called Data:${JSON.stringify(data)}`);
      await this.roleRepo.createQueryBuilder('r').insert().into(ROLE).values(data).execute();
      return { status: 201, message: 'Create Role Success' };
    } catch (error) {
      this.logger.error(`${this.createRole.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async updateRoleById({ roleId, ...data }: UpdateRoleDTO): Promise<BaseResponse> {
    try {
      this.logger.log(`${this.updateRoleById.name} called Data:${JSON.stringify(data)}`);
      await this.roleRepo
        .createQueryBuilder()
        .update(ROLE)
        .set(data)
        .where('role_id = :roleId')
        .setParameters({ roleId })
        .execute();
      return { status: 200, message: 'Update Role Success' };
    } catch (error) {
      this.logger.error(`${this.updateRoleById.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }

  async assignPermission(data: AssignPermissionDTO): Promise<BaseResponse> {
    try {
      this.logger.log(`${this.assignPermission.name} called Data:${JSON.stringify(data)}`);
      const { permissionIds, roleId } = data;

      //  delete permission
      await this.rolePermissionRepo
        .createQueryBuilder()
        .delete()
        .from(ROLE_PERMISSION)
        .where(`permission_id not in (:...permissionIds)`)
        .andWhere('role_id = roleId')
        .setParameters({ permissionIds, roleId })
        .execute();

      const toBeCreated = CreateRolePermissionDTO.toBeCreated(roleId, permissionIds);


      // update permission
      await this.rolePermissionRepo
        .createQueryBuilder()
        .insert()
        .into(ROLE_PERMISSION)
        .values(toBeCreated)
        .orIgnore(true)
        .execute();

      return { status: 200, message: 'Assign Permission Success' };
    } catch (error) {
      this.logger.error(`${this.assignPermission.name} Error:${error.message}`);
      throw new RpcException({ status: error.status || 500, message: error.message });
    }
  }
}
