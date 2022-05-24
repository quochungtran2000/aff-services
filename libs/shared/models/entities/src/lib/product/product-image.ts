import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product';

@Entity({ schema: 'public', name: 'product_image' })
export class PRODUCT_IMAGE {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => Product, (p) => p.productImages)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product?: Product;
}
