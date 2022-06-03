import { createConnection } from 'typeorm';
import { DB_CON_TOKEN } from './database.constant';
import { config } from '../config/configurations';
import {
  APERMISSION,
  AROLE,
  AROLE_PERMISSION,
  CATEGORY,
  CRAWL_CATEGORY,
  MAPPING_CATEGORY,
  PERMISSION,
  POST,
  POST_COMMENT,
  Product,
  PRODUCT_AFFILIATE_LINK,
  PRODUCT_COMMENT,
  PRODUCT_COMMENT_IMAGE,
  PRODUCT_PRODUCT,
  PRODUCT_TEMPLATE,
  PRODUCT_VARIANTS,
  PRODUCT_VARIANT_IMAGE,
  ROLE,
  ROLE_PERMISSION,
  USER,
  USER_SAVE_POST,
  USER_SAVE_PRODUCT,
  V_PRODUCT_TEMPLATE,
} from '@aff-services/shared/models/entities';

export const databaseProviders = [
  {
    provide: DB_CON_TOKEN,
    useFactory: async () => {
      const POSTGRES_USER = config.database.user || 'beone';
      const POSTGRES_PASSWORD = config.database.password || 'beone';
      const POSTGRES_DATABASE = config.database.dbName || 'pnj_tms';
      const POSTGRES_HOST = config.database.host || '127.0.0.1';
      const POSTGRES_PORT = '5432';

      return await createConnection({
        type: 'postgres',
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DATABASE,
        entities: [
          USER,
          PERMISSION,
          ROLE,
          ROLE_PERMISSION,
          AROLE,
          APERMISSION,
          AROLE_PERMISSION,
          Product,
          PRODUCT_PRODUCT,
          PRODUCT_TEMPLATE,
          CRAWL_CATEGORY,
          MAPPING_CATEGORY,
          CATEGORY,
          V_PRODUCT_TEMPLATE,
          PRODUCT_AFFILIATE_LINK,
          PRODUCT_VARIANTS,
          PRODUCT_VARIANT_IMAGE,
          PRODUCT_COMMENT,
          PRODUCT_COMMENT_IMAGE,
          USER_SAVE_PRODUCT,
          POST,
          USER_SAVE_POST,
          POST_COMMENT,
        ],
        // synchronize: true,
        // logging: true,
      });
    },
  },
];
