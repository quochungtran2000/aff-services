import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from './product';
import { PRODUCT_VARIANT_IMAGE } from './product-variant-image';

@Entity({ schema: 'public', name: 'product_variants' })
export class PRODUCT_VARIANTS {
  @PrimaryColumn({ name: 'sku' })
  sku: string;

  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_name' })
  variantName: string;

  @Column({ name: 'variant_image_url' })
  variantImageUrl: string;

  @Column({ name: 'list_price' })
  listPrice: number;

  @Column({ name: 'sale_price' })
  salePrice: number;

  @Column({ name: 'is_sale' })
  isSale: boolean;

  @Column({ name: 'discount_percent' })
  discountPercent: number;

  @ManyToOne(() => Product, (p) => p.variants)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product: Product;

  @OneToMany(() => PRODUCT_VARIANT_IMAGE, (pvi) => pvi.productVariants)
  @JoinColumn([
    { name: 'product_id', referencedColumnName: 'productId' },
    { name: 'sku', referencedColumnName: 'sku' },
  ])
  images: PRODUCT_VARIANT_IMAGE[];
}
