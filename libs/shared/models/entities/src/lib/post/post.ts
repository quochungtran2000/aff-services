import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { USER } from '../user';
import { USER_SAVE_POST } from '../user/user-save-post';
import { POST_COMMENT } from './post-comment';

@Entity({ schema: 'public', name: 'post' })
export class POST {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column({ name: 'post_title' })
  postTitle: string;

  @Column({ name: 'post_thumbnail' })
  postThumbnail: string;

  @Column({ name: 'post_type' })
  postType: string;

  @Column({ name: 'post_content' })
  postContent: string;

  @Column({ name: 'post_author' })
  postAuthor: number;

  @Column({ name: 'total_view', default: 0 })
  totalView: number;

  @Column({ name: 'is_delete' })
  isDelete: boolean;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => USER, (user) => user.posts)
  @JoinColumn({ name: 'post_author', referencedColumnName: 'userId' })
  author: USER;

  @OneToOne(() => USER_SAVE_POST, (usp) => usp.post)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'postId' })
  savePosts: POST;

  // @OneToMany(() => POST_COMMENT, pc => pc.post )
}
