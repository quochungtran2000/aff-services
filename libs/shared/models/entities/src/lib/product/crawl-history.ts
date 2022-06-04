import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'crawl_history' })
export class CRAWL_HISTORY {
  @PrimaryColumn({ name: 'crawl_hisotry_id' })
  crawlHistoryId: number;

  @PrimaryColumn({ name: 'product_id' })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;
}
