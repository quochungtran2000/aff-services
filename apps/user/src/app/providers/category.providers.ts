import { CATEGORY, CRAWL_CATEGORY, MAPPING_CATEGORY } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const categoryProviders = [
  {
    provide: 'CRAWL_CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CRAWL_CATEGORY),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CATEGORY),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'MAPPING_CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(MAPPING_CATEGORY),
    inject: [DB_CON_TOKEN],
  },
];
