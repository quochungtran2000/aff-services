import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product';
import { PRODUCT_COMMENT_IMAGE } from './product-comment-image';

@Entity({ schema: 'public', name: 'product_comment' })
export class PRODUCT_COMMENT {
  @PrimaryGeneratedColumn({ name: 'product_comment_id' })
  productCommentId: number;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'customer_satisfaction_level' })
  customerSatisfactionLevel: string;

  @Column({ name: 'content' })
  content: string;

  // @ManyToOne(() => Product, (p) => p.productImages)
  // @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  // product?: Product;

  @OneToMany(() => PRODUCT_COMMENT_IMAGE, (pci) => pci.productComment)
  @JoinColumn({ name: 'product_comment_id', referencedColumnName: 'productCommentId' })
  images: PRODUCT_COMMENT_IMAGE[];

  @ManyToOne(() => Product, (p) => p.comments)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product: Product;
}
