import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_PRODUCT } from './product-product';

@Entity({ schema: 'public', name: 'view_product_template' })
export class V_PRODUCT_TEMPLATE {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'thumbnail' })
  thumbnail: string;

  // @Column({ name: 'price' })
  // price: number;

  // @Column({ name: 'average' })
  // average: number;

  @Column()
  slug: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PRODUCT_PRODUCT, (pp) => pp.productTemplate)
  @JoinColumn({ name: 'id', referencedColumnName: 'productTemplateId' })
  productProducts: PRODUCT_PRODUCT[];
}
