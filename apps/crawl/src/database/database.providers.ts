import { createConnection } from 'typeorm';
import { DB_CON_TOKEN } from './database.constant';
import { config } from '../config/configurations';
import {
  CONFIG,
  CRAWL_CATEGORY,
  Product,
  PRODUCT_PRODUCT,
  PRODUCT_TEMPLATE,
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
        entities: [Product, PRODUCT_PRODUCT, PRODUCT_TEMPLATE, CONFIG, CRAWL_CATEGORY],
        // synchronize: true,
        // logging: true,
      });
    },
  },
];
