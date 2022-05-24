import { CONFIG } from '@aff-services/shared/models/entities';
import { DbConfigName } from '@aff-services/shared/utils/helpers';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigRepo {
  private readonly logger = new Logger(`Micro-Crawl.${ConfigRepo.name}`);
  constructor(@Inject('CONFIG_REPOSITORY') private readonly configRepo: Repository<CONFIG>) {}

  async getDbConfig(key: DbConfigName) {
    this.logger.log(`${this.getDbConfig.name} called`);
    return await this.configRepo
      .createQueryBuilder('c')
      .where('UPPER(c.name) = UPPER(:key) ')
      .setParameters({ key })
      .getOne();
  }

  async getAll() {
    this.logger.log(`${this.getAll.name} called`);
    return await this.configRepo.createQueryBuilder('c').getMany();
  }

  async getDbConfigMerchantUrl(merchant: string) {
    this.logger.log(`${this.getDbConfigMerchantUrl.name} merchant:${merchant}`);
    return await this.configRepo
      .createQueryBuilder('c')
      .where(`c.name = :name`)
      .setParameters({ name: merchant + '_url' })
      .getOne();
  }
}
