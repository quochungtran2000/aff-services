import { CRAWL_HISTORY, CRAWL_PRODUCT_HISTORY } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const crawlProviders = [
  {
    provide: 'CRAWL_HISTORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CRAWL_HISTORY),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'CRAWL_PRODUCT_HISTORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CRAWL_PRODUCT_HISTORY),
    inject: [DB_CON_TOKEN],
  },
];
