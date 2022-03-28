import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { APERMISSION } from './permission';
import { AROLE } from './role';

@Entity({ schema: 'auth', name: 'role_permission' })
export class AROLE_PERMISSION {
  @PrimaryColumn()
  role: string;

  @Column()
  permission: string;

  @ManyToOne(() => AROLE, (r) => r.aRolePermission)
  @JoinColumn({ name: 'role', referencedColumnName: 'role' })
  arole: AROLE;

  @ManyToOne(() => APERMISSION, (p) => p.aRolePermission)
  @JoinColumn({ name: 'permission', referencedColumnName: 'permission' })
  apermission: APERMISSION;
}
