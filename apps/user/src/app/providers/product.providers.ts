import {
  Product,
  PRODUCT_COMMENT,
  PRODUCT_PRODUCT,
  PRODUCT_TEMPLATE,
  USER_SAVE_PRODUCT,
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
    provide: 'PRODUCT_COMMENT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PRODUCT_COMMENT),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'USER_SAVE_PRODUCT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(USER_SAVE_PRODUCT),
    inject: [DB_CON_TOKEN],
  },
];
