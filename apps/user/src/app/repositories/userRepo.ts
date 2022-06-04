import { PagingUserResponse, RegisterPayload, UserQuery, UserResponse } from '@aff-services/shared/models/dtos';
import { USER } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepo {
  private readonly logger = new Logger(`Micro-User.${UserRepo.name}`);

  constructor(@Inject('USER_REPOSITORY') private readonly userRepo: Repository<USER>) {}

  async findOneByUserName(username: string) {
    this.logger.log(`${this.findOneByUserName.name} Ref:${username}`);
    return this.userRepo.createQueryBuilder('u').where('u.username = :username', { username }).getOne();
  }

  async findOneByUserId(userId: number) {
    this.logger.log(`${this.findOneByUserId.name} Ref:${userId}`);
    return this.userRepo.createQueryBuilder('u').where('u.user_id = :userId', { userId }).getOne();
  }

  async findOneByUserIdAndUpdatePassword(userId: number, password: string) {
    this.logger.log(`${this.findOneByUserIdAndUpdatePassword.name} Ref:${userId}`);
    return this.userRepo
      .createQueryBuilder()
      .update(USER)
      .set({ password })
      .where('user_id = :userId')
      .setParameters({ userId })
      .execute();
  }

  async findUserLogin(username: string) {
    return this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
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

  async createUser(data: Partial<RegisterPayload>) {
    this.logger.log(`${this.createUser.name} ${JSON.stringify(data)}`);
    return this.userRepo.createQueryBuilder().insert().into(USER).values(data).execute();
  }

  async getUsers(query: UserQuery) {
    try {
      this.logger.log(`${this.getUsers.name} Query:${JSON.stringify(query)}`);
      const { page, pageSize, column, sort, username, fullname, email, phoneNumber, search } = query;
      const skip = (page - 1) * pageSize;

      const qr = this.userRepo.createQueryBuilder('u').where(`1=1`);

      if (username) qr.andWhere(`UPPER(u.username) like '%' || UPPER(:username) || '%'`);
      if (fullname) qr.andWhere(`UPPER(u.fullname) like '%' || UPPER(:fullname) || '%'`);
      if (phoneNumber) qr.andWhere(`UPPER(u.phone_number) like '%' || UPPER(:phoneNumber) || '%'`);
      if (email) qr.andWhere(`UPPER(u.email) like '%' || UPPER(:email) || '%'`);

      if (search)
        qr.andWhere(
          `(` +
            `UPPER(u.username) like '%' || UPPER(:search) || '%'` +
            `or UPPER(u.fullname) like '%' || UPPER(:search) || '%'` +
            `or UPPER(u.phone_number) like '%' || UPPER(:search) || '%'` +
            `or UPPER(u.email) like '%' || UPPER(:search) || '%'` +
            ')'
        );

      const [data, total] = await qr
        .take(pageSize)
        .skip(skip)
        .orderBy(`u.${column}`, sort)
        .setParameters({ username, fullname, phoneNumber, email, search })
        .getManyAndCount();

      return PagingUserResponse.from(total, data);
      // return { total, data: data.map((elm) => UserResponse.haveRole(elm)) };
    } catch (error) {
      this.logger.error(`${this.getUsers.name} Error:${error.message}`);
    }
  }
}
