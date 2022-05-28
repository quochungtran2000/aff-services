import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product';
import { PRODUCT_VARIANTS } from './product-variants';

@Entity({ schema: 'public', name: 'product_variant_image' })
export class PRODUCT_VARIANT_IMAGE {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'sku' })
  sku: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => PRODUCT_VARIANTS, (pv) => pv.images)
  @JoinColumn([
    { name: 'product_id', referencedColumnName: 'productId' },
    { name: 'sku', referencedColumnName: 'sku' },
  ])
  productVariants?: PRODUCT_VARIANTS;
}
