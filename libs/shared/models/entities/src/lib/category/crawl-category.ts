import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'crawl_category' })
export class CRAWL_CATEGORY {
  @PrimaryColumn({ name: 'crawl_category_id' })
  crawlCategoryId: string;

  @Column({ name: 'merchant' })
  merchant: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'parent_id' })
  parentId: string;

  @Column({ name: 'active' })
  active: boolean;

  @Column({ name: 'crawl' })
  crawl: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @OneToMany(() => CRAWL_CATEGORY, (c) => c.subCategory)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'crawlCategoryId' })
  subCategory: CRAWL_CATEGORY;
}
