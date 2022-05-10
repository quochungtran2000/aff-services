import { CONFIG } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const configProviders = [
  {
    provide: 'CONFIG_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(CONFIG),
    inject: [DB_CON_TOKEN],
  },
];
