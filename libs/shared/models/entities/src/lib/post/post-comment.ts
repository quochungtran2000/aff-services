import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { USER } from '../user';

@Entity({ schema: 'public', name: 'post_comment' })
export class POST_COMMENT {
  @PrimaryGeneratedColumn({ name: 'post_comment_id' })
  postCommentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'post_id' })
  postId: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'parent_id' })
  parentId?: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => USER, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  customer: USER;

  // @ManyToOne(() => POST, (post) => post.comments)
  // @JoinColumn({ name: 'post_id', referencedColumnName: 'postId' })
  // post: POST;

  @OneToMany(() => POST_COMMENT, (pc) => pc.parent)
  @JoinColumn({ name: 'post_comment_id', referencedColumnName: 'parentId' })
  childrens: POST_COMMENT[];

  @ManyToOne(() => POST_COMMENT, (pc) => pc.childrens)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'postCommentId' })
  parent: POST_COMMENT;
}
