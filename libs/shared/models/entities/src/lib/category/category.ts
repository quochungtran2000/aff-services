import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { MAPPING_CATEGORY } from './mapping-category';

@Entity({ schema: 'public', name: 'category' })
export class CATEGORY {
  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'active' })
  active: boolean;

  @Column({ name: 'crawl' })
  crawl: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToMany(() => MAPPING_CATEGORY, (mc) => mc.category)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'categoryId' })
  mappingCategory: MAPPING_CATEGORY[];
}
