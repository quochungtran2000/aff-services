import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { AROLE_PERMISSION } from './role-permission';

@Entity({ schema: 'auth', name: 'role' })
export class AROLE {
  @PrimaryColumn()
  role: string;

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToMany(() => AROLE_PERMISSION, (rp) => rp.arole)
  @JoinColumn({ name: 'role', referencedColumnName: 'role' })
  aRolePermission: AROLE_PERMISSION;
}
