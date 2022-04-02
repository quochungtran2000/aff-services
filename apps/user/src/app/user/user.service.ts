import { UserQuery } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { UserRepo } from '../repositories/userRepo';

@Injectable()
export class UserService {
  private readonly logger = new Logger(`Micro-User.${UserService.name}`);
  constructor(private readonly userRepo: UserRepo) {}

  async adminGetUsers(query: UserQuery) {
    this.logger.log(`${this.adminGetUsers.name} called`);
    return this.userRepo.getUsers(query);
  }
}
