import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { CRAWL_CATEGORY } from '../category';
import { CRAWL_PRODUCT_HISTORY } from './crawl-product-history';
import { PRODUCT_AFFILIATE_LINK } from './product-affiliate-link';
import { PRODUCT_COMMENT } from './product-comment';
// import { PRODUCT_IMAGE } from './product-image';
import { PRODUCT_PRODUCT } from './product-product';
import { PRODUCT_VARIANTS } from './product-variants';

@Entity({ schema: 'public', name: 'product' })
export class Product {
  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'slug' })
  slug: string;

  @Column({ name: 'original_url' })
  originalUrl: string;

  @Column({ name: 'thumbnail' })
  thumbnail: string;

  @Column({ name: 'is_complete_crawl' })
  isCompleteCrawl: boolean;

  @Column({ name: 'is_complete_update' })
  isCompleteUpdate: boolean;

  @Column({ name: 'average' })
  average: number;

  @Column({ name: 'sold' })
  sold: number;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'merchant' })
  merchant: string;

  @Column({ name: 'crawl_category_id' })
  crawlCategoryId: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @Column({ name: 'lastest_crawl_at', type: 'timestamp', default: '() => now()' })
  lastestCrawlAt: Date;

  @OneToOne(() => PRODUCT_PRODUCT)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  productProduct: PRODUCT_PRODUCT;

  @OneToMany(() => PRODUCT_AFFILIATE_LINK, (pal) => pal.product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  productAffiliateLinks: PRODUCT_AFFILIATE_LINK[];

  @OneToMany(() => PRODUCT_VARIANTS, (pv) => pv.product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  variants: PRODUCT_VARIANTS[];

  @OneToMany(() => PRODUCT_COMMENT, (pc) => pc.product)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  comments: PRODUCT_COMMENT[];

  @ManyToOne(() => CRAWL_CATEGORY, (cc) => cc.products)
  @JoinColumn({ name: 'crawl_category_id', referencedColumnName: 'crawlCategoryId' })
  crawlCategory: CRAWL_CATEGORY;
  // @OneToMany(() => PRODUCT_IMAGE, (image) => image.product)
  // @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  // productImages: PRODUCT_IMAGE[];

  @OneToOne(() => CRAWL_PRODUCT_HISTORY)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  productHistory: CRAWL_PRODUCT_HISTORY;
}
