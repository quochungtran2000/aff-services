import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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
}
