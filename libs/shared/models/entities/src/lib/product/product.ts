import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { PRODUCT_PRODUCT } from './product-product';

@Entity({ schema: 'public', name: 'product' })
export class Product {
  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'thumbnail' })
  thumbnail: string;

  @Column({ name: 'is_sale' })
  isSale: boolean;

  @Column({ name: 'sale_price' })
  salePrice: number;

  @Column({ name: 'discount_percent' })
  discountPercent: number;

  @Column({ name: 'average' })
  average: number;

  @Column({ name: 'sold' })
  sold: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'merchant' })
  merchant: string;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'product_url' })
  productUrl: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => PRODUCT_PRODUCT)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  productProduct: PRODUCT_PRODUCT;
}
