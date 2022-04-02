import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE_PERMISSION } from './role-permission';

@Entity({ schema: 'public', name: 'permission' })
export class PERMISSION {
  @PrimaryGeneratedColumn({ name: 'permission_id' })
  permissionId: number;

  @Column({ name: 'permission_name', nullable: false })
  permissionName: string;

  @Column({ name: 'slug', unique: true, nullable: false })
  slug: string;

  @OneToMany(() => ROLE_PERMISSION, (rp) => rp.permission)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'permissionId' })
  rolePermissions: ROLE_PERMISSION[];
}
