import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_PRODUCT } from './product-product';

@Entity({ schema: 'public', name: 'product_template' })
export class PRODUCT_TEMPLATE {
  @PrimaryGeneratedColumn({ name: 'product_template_id' })
  productTemplateId: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'thumbnail' })
  thumbnail: string;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'average' })
  average: number;

  @Column({ name: 'slug', unique: true })
  slug: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PRODUCT_PRODUCT, (pp) => pp.productTemplate)
  @JoinColumn({ name: 'product_template_id', referencedColumnName: 'productTemplateId' })
  productProducts: PRODUCT_PRODUCT[];
}
