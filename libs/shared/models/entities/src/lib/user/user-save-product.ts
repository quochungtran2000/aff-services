import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PRODUCT_TEMPLATE } from '../product';
import { USER } from './user';

@Entity({ schema: 'public', name: 'user_save_product' })
export class USER_SAVE_PRODUCT {
  @PrimaryColumn({ name: 'user_id', type: 'integer' })
  userId: number;

  @PrimaryColumn({ name: 'product_template_id', type: 'integer' })
  productTemplateId: number;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @ManyToOne(() => PRODUCT_TEMPLATE, (pt) => pt.saveProducts)
  @JoinColumn({ name: 'product_template_id', referencedColumnName: 'productTemplateId' })
  products: PRODUCT_TEMPLATE;

  // @ManyToOne(() => USER, (u) => u.saveProducts)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  // customer: USER;
}
