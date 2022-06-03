import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { POST } from '../post';

@Entity({ schema: 'public', name: 'user_save_post' })
export class USER_SAVE_POST {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'post_id' })
  postId: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => POST, (post) => post.savePosts)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'postId' })
  post: POST;
}
