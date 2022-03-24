import { Injectable, Logger } from '@nestjs/common';
import { UserRepo } from '../repositories/userRepo';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(`Micro-User.${AuthService.name}`);

  constructor(private readonly userRepo: UserRepo) {}

  async find(query: any) {
    this.logger.log(`${this.find.name} Query:${JSON.stringify(query)}`);
    return this.userRepo.find(query);
  }
}
