import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE_PERMISSION } from './role-permission';

@Entity({ schema: 'public', name: 'role' })
export class ROLE {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_name', nullable: false })
  roleName: string;

  @Column({ name: 'description' })
  description: string;

  @OneToMany(() => ROLE_PERMISSION, (rp) => rp.role)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  rolePermissions: ROLE_PERMISSION[];
}
