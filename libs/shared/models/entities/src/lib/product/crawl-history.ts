import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { CRAWL_PRODUCT_HISTORY } from './crawl-product-history';

@Entity({ schema: 'public', name: 'crawl_history' })
export class CRAWL_HISTORY {
  @PrimaryGeneratedColumn({ name: 'crawl_history_id' })
  crawlHistoryId: number;

  @PrimaryColumn({ name: 'status', default: 'pending' })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToMany(() => CRAWL_PRODUCT_HISTORY, (cph) => cph.crawlHistory)
  @JoinColumn({ name: 'crawl_history_id', referencedColumnName: 'crawlHistoryId' })
  product_history: CRAWL_PRODUCT_HISTORY[];
}
