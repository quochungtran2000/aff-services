import { User } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepo {
  private readonly logger = new Logger(`Micro-User.${UserRepo.name}`);

  constructor(@Inject('USER_REPOSITORY') private readonly userRepo: Repository<User>) {}

  async find(query: any = {}) {
    this.logger.log(`${this.find.name} Query:${JSON.stringify(query)}`);
    return await this.userRepo.find(query);
  }
}
