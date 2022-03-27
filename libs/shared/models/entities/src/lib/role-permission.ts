import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PERMISSION } from './permission';
import { ROLE } from './role';

@Entity({ schema: 'public', name: 'role_permission' })
export class ROLE_PERMISSION {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  permission_id: number;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @ManyToOne(() => ROLE, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: ROLE;

  @ManyToOne(() => PERMISSION, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'permissionId' })
  permission: PERMISSION;
}
