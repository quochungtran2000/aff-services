import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { CRAWL_HISTORY } from './crawl-history';
import { Product } from './product';

@Entity({ schema: 'public', name: 'crawl_product_history' })
export class CRAWL_PRODUCT_HISTORY {
  @PrimaryColumn({ name: 'crawl_history_id' })
  crawlHistoryId: number;

  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @PrimaryColumn({ name: 'status', default: 'pending' })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToMany(() => CRAWL_HISTORY, (cr) => cr.product_history)
  @JoinColumn({ name: 'crawl_history_id', referencedColumnName: 'crawlHistoryId' })
  crawlHistory: CRAWL_HISTORY[];

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product: Product;
}
