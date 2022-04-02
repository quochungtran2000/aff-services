import { PERMISSION, ROLE, ROLE_PERMISSION } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const AccessControlProviders = [
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(ROLE),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'ROLE_PERMISSION_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(ROLE_PERMISSION),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(PERMISSION),
    inject: [DB_CON_TOKEN],
  },
];
