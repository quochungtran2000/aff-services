import { UserQueryDTO } from '@aff-services/shared/models/dtos';
import { USER } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepo {
  private readonly logger = new Logger(`Micro-User.${UserRepo.name}`);

  constructor(@Inject('USER_REPOSITORY') private readonly userRepo: Repository<USER>) {}

  async find(query: UserQueryDTO) {
    this.logger.log(`${this.find.name} Query:${JSON.stringify(query)}`);
    const { username } = query;

    const qr = this.userRepo
      .createQueryBuilder('u')
      .where('1=1')
      .leftJoinAndSelect('u.role', 'r')
      .leftJoinAndSelect('r.rolePermissions', 'rp')
      .leftJoinAndSelect('rp.permission', 'p');

    if (username) qr.andWhere(`u.username like '%' || :username || '%'`);

    const [data, total] = await qr.setParameters({ username }).getManyAndCount();

    return { total, data };
  }

  async findOneByUserName(username: string) {
    this.logger.log(`${this.findOneByUserName.name} Ref:${username}`);
    return this.userRepo.createQueryBuilder('u').where('u.username = :username', { username }).getOne();
  }

  async findOneByUserId(userId: number) {
    this.logger.log(`${this.findOneByUserId.name} Ref:${userId}`);
    return this.userRepo.createQueryBuilder('u').where('u.user_id = :userId', { userId }).getOne();
  }

  async findUserLogin(username: string) {
    return this.userRepo
      .createQueryBuilder('u')
      .where('u.username = :username')
      .orWhere('u.email = :username')
      .orWhere('u.phone_number = :username')
      .setParameters({ username })
      .getOne();
  }

  async getProfileByUserId(userId: number) {
    this.logger.log(`${this.getProfileByUserId.name} Ref:${userId}`);
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .where('u.user_id = :userId', { userId })
      .getOne();
  }
}
