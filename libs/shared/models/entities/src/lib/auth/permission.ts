import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AROLE_PERMISSION } from './role-permission';

@Entity({ schema: 'auth', name: 'permission' })
export class APERMISSION {
  @PrimaryColumn()
  permission: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToMany(() => AROLE_PERMISSION, (rp) => rp.apermission)
  @JoinColumn({ name: 'permission', referencedColumnName: 'permission' })
  aRolePermission: AROLE_PERMISSION[];
}
