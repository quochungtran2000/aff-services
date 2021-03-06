import { Product, PRODUCT_PRODUCT, PRODUCT_TEMPLATE } from '@aff-services/shared/models/entities';
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
];
