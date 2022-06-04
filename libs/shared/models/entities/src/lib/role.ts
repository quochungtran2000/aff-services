import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE_PERMISSION } from './role-permission';
import { USER } from './user';

@Entity({ schema: 'public', name: 'role' })
export class ROLE {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'role_name', nullable: false })
  roleName: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'slug', unique: true, nullable: false })
  slug: string;

  @OneToOne(() => USER, (u) => u.role)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  user: USER;

  @OneToMany(() => ROLE_PERMISSION, (rp) => rp.role)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  rolePermissions: ROLE_PERMISSION[];
}
