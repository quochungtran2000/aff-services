import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product';

@Entity({ schema: 'public', name: 'product_affiliate_link' })
export class PRODUCT_AFFILIATE_LINK {
  @PrimaryColumn({ name: 'product_affiliate_link_id' })
  productAffiliateLinkId: number;

  @PrimaryColumn({ name: 'product_id' })
  productId: string;

  @Column({ name: 'campaign_id' })
  campaignId: string;

  @Column({ name: 'click_url' })
  clickUrl: string;

  @Column({ name: 'merchant_id' })
  merchantId: string;

  @Column({ name: 'origin_url' })
  originUrl: string;

  @Column({ name: 'publisher_id' })
  publisherId: string;

  @Column({ name: 'short_url' })
  shortUrl: string;

  @Column({ name: 'utm_campaign' })
  utmCampaign: string;

  @Column({ name: 'utm_content' })
  utmContent: string;

  @Column({ name: 'utm_medium' })
  utmMedium: string;

  @Column({ name: 'utm_source' })
  utmSource: string;

  @Column({ name: 'utm_term' })
  utmTerm: string;

  @Column({ name: 'created_at', type: 'timestamp', default: '() => now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: '() => now()' })
  updatedAt: Date;

  @ManyToOne(() => Product, (p) => p.productAffiliateLinks)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'productId' })
  product: Product;
}
