import { POST } from '@aff-services/shared/models/entities';
import { Connection } from 'typeorm';
import { DB_CON_TOKEN } from '../../database/database.constant';

export const postProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(POST),
    inject: [DB_CON_TOKEN],
  },
];
