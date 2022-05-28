import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_COMMENT } from './product-comment';

@Entity({ schema: 'public', name: 'product_comment_image' })
export class PRODUCT_COMMENT_IMAGE {
  @PrimaryGeneratedColumn({ name: 'product_comment_image_id' })
  productCommentImageId: number;

  @Column({ name: 'product_comment_id' })
  productCommentId: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => PRODUCT_COMMENT, (pc) => pc.images)
  @JoinColumn({ name: 'product_comment_id', referencedColumnName: 'productCommentId' })
  productComment?: PRODUCT_COMMENT;
}
