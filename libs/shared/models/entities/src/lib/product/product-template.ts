import { Column, Entity, Generated, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_PRODUCT } from './product-product';

@Entity({ schema: 'public', name: 'product_template' })
export class PRODUCT_TEMPLATE {
  @PrimaryGeneratedColumn({ name: 'product_template_id' })
  productTemplateId: number;

  // @PrimaryColumn()
  // slug: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'product_short_name' })
  productShortName: string;

  @Column({ name: 'thumbnail' })
  thumbnail: string;

  // @Generated({ name: 'product_template_id', type: 'in' })
  // @Generated('increment')
  // @Column({ name: 'product_template_id', type: 'integer' })
  // productTemplateId: number;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'slug1', unique: true })
  slug1: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PRODUCT_PRODUCT, (pp) => pp.productTemplate)
  @JoinColumn({ name: 'product_template_id', referencedColumnName: 'productTemplateId' })
  productProducts: PRODUCT_PRODUCT[];
}
