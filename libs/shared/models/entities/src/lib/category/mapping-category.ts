import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CATEGORY } from './category';
import { CRAWL_CATEGORY } from './crawl-category';

@Entity({ schema: 'public', name: 'mapping_category' })
export class MAPPING_CATEGORY {
  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @PrimaryColumn({ name: 'crawl_category_id' })
  crawlCategoryId: string;

  @ManyToOne(() => CATEGORY, (cate) => cate.mappingCategory)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'categoryId' })
  category?: CATEGORY;

  @ManyToOne(() => CRAWL_CATEGORY, (cra) => cra.mappingCategory)
  @JoinColumn({ name: 'crawl_category_id', referencedColumnName: 'crawlCategoryId' })
  crawlCategory?: CRAWL_CATEGORY;
}
