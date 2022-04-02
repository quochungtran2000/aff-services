import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PERMISSION } from './permission';
import { ROLE } from './role';

@Entity({ schema: 'public', name: 'role_permission' })
export class ROLE_PERMISSION {
  @PrimaryColumn({ name: 'permission_id' })
  permissionId: number;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => ROLE, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: ROLE;

  @ManyToOne(() => PERMISSION, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'permissionId' })
  permission: PERMISSION;
}
