import {
  CRAWL_CATEGORY,
  Product,
  PRODUCT_PRODUCT,
  PRODUCT_TEMPLATE,
  PRODUCT_VARIANTS,
  PRODUCT_VARIANT_IMAGE,
} from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const productProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Product),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PRODUCT_PRODUCT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_PRODUCT),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PRODUCT_TEMPLATE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_TEMPLATE),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PRODUCT_VARIANT_IMAGE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_VARIANT_IMAGE),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PRODUCT_VARIANTS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_VARIANTS),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PRODUCT_COMMENT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_VARIANTS),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PRODUCT_COMMENT_IMAGE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_VARIANTS),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'CRAWL_CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CRAWL_CATEGORY),
    inject: [DB_CON_TOKEN],
  },
];
