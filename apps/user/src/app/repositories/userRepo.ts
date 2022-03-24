import { UserQueryDTO } from '@aff-services/shared/models/dtos';
import { User } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepo {
  private readonly logger = new Logger(`Micro-User.${UserRepo.name}`);

  constructor(@Inject('USER_REPOSITORY') private readonly userRepo: Repository<User>) {}

  async find(query: UserQueryDTO) {
    this.logger.log(`${this.find.name} Query:${JSON.stringify(query)}`);
    const { username } = query;

    const qr = this.userRepo.createQueryBuilder('u').where('1=1');

    if (username) qr.andWhere(`u.username like '%' || :username || '%'`);

    return await qr.setParameters({ username }).getMany();
  }
}
