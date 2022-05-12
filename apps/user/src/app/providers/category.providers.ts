import { CRAWL_CATEGORY } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const categoryProviders = [
  {
    provide: 'CRAWL_CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CRAWL_CATEGORY),
    inject: [DB_CON_TOKEN],
  },
];
