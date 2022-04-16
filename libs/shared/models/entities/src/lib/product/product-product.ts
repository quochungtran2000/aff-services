import { Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product';
import { PRODUCT_TEMPLATE } from './product-template';

@Entity({ schema: 'public', name: 'product_product' })
export class PRODUCT_PRODUCT {
  @PrimaryColumn({ name: 'product_template_id' })
  productTemplateId: number;

  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => PRODUCT_TEMPLATE, (pt) => pt.productProducts)
  @JoinColumn({ name: 'product_template_id', referencedColumnName: 'productTemplateId' })
  productTemplate: PRODUCT_TEMPLATE;

  @OneToOne(() => Product, (p) => p.productProduct)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product?: Product;
}
