import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

export class BcryptService {
  private readonly logger = new Logger(`Service.${BcryptService.name}`);
  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    this.logger.log(`${this.hashPassword.name} called`);
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    this.logger.log(`${this.comparePassword.name} called`);
    return await bcrypt.compare(password, hashPassword);
  }
}
