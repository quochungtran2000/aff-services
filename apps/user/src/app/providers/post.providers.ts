import { POST, USER_SAVE_POST } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(POST),
    inject: [DB_CON_TOKEN],
  },
  {
    provide: 'USER_SAVE_POST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(USER_SAVE_POST),
    inject: [DB_CON_TOKEN],
  },
];
