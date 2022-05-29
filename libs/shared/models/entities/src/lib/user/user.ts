import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE } from '../role';

@Entity({ schema: 'public', name: 'user' })
export class USER {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'username', nullable: false })
  username: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'fullname', nullable: false })
  fullname: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'phone_number', nullable: false })
  phoneNumber: string;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToOne(() => ROLE)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: ROLE;

  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;
}
