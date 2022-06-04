import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { POST } from '../post';
import { POST_COMMENT } from '../post/post-comment';
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

  @Column({ name: 'img_url', nullable: false })
  imgUrl: string;

  @Column({ name: 'phone_number', nullable: false })
  phoneNumber: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToOne(() => ROLE, (role) => role.user)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'roleId' })
  role: ROLE;

  // @OneToMany(() => USER_SAVE_PRODUCT, 'customer')
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  // saveProducts: USER_SAVE_PRODUCT[];

  @OneToMany(() => POST, (post) => post.author)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'postAuthor' })
  posts: POST[];

  @OneToMany(() => POST_COMMENT, (pc) => pc.customer)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  comments: POST_COMMENT[];
}
