import { CONFIG } from '@aff-services/shared/models/entities';
import { DbConfigName } from '@aff-services/shared/utils/helpers';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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

  async getOneOrFailByName(name: string, errors?: string[]) {
    try {
      this.logger.log(`${this.getDbConfig.name} ${name}`);
      return await this.configRepo
        .createQueryBuilder('c')
        .where('UPPER(c.name) = UPPER(:name) ')
        .setParameters({ name })
        .getOneOrFail();
    } catch (error) {
      errors.push(name);
    }
  }

  async getCrawlConfig() {
    try {
      this.logger.log(`${this.getCrawlConfig.name} called!`);
      const errors = [];

      const config = await Promise.all([
        this.getOneOrFailByName('tiki_url', errors),
        this.getOneOrFailByName('tiki_item', errors),
        this.getOneOrFailByName('tiki_item_thumbnail', errors),
        this.getOneOrFailByName('tiki_item_url', errors),
        this.getOneOrFailByName('tiki_item_name', errors),
        this.getOneOrFailByName('tiki_item_sale_price', errors),
        this.getOneOrFailByName('tiki_item_discount_percent', errors),
        this.getOneOrFailByName('tiki_item_sold', errors),
        this.getOneOrFailByName('tiki_item_rate', errors),
        this.getOneOrFailByName('shopee_url', errors),
        this.getOneOrFailByName('shopee_item', errors),
        this.getOneOrFailByName('shopee_item_thumbnail', errors),
        this.getOneOrFailByName('shopee_item_url', errors),
        this.getOneOrFailByName('shopee_item_name', errors),
        this.getOneOrFailByName('shopee_item_sale_price', errors),
        this.getOneOrFailByName('shopee_item_discoun_percent', errors),
        this.getOneOrFailByName('shopee_item_sold', errors),
        this.getOneOrFailByName('shopee_item_rate', errors),
        this.getOneOrFailByName('lazada_url', errors),
        this.getOneOrFailByName('lazada_item', errors),
        this.getOneOrFailByName('lazada_item_thumbnail', errors),
        this.getOneOrFailByName('lazada_item_url', errors),
        this.getOneOrFailByName('lazada_item_name', errors),
        this.getOneOrFailByName('lazada_item_sale_price', errors),
        this.getOneOrFailByName('lazada_item_list_price', errors),
        this.getOneOrFailByName('lazada_item_discount_percent', errors),
        this.getOneOrFailByName('lazada_item_rate', errors),
      ]);

      const crawlUrl = {
        tiki: config[0].value,
        shopee: config[9].value,
        lazada: config[18].value,
      };

      const crawlConfig = {
        tiki: {
          item: config[1].value,
          thumbnail: config[2].value,
          url: config[3].value,
          name: config[4].value,
          salePrice: config[5].value,
          discountPercent: config[6].value,
          sold: config[7].value,
          rate: config[8].value,
        },
        shopee: {
          item: config[10].value,
          thumbnail: config[11].value,
          url: config[12].value,
          name: config[13].value,
          salePrice: config[14].value,
          discountPercent: config[15].value,
          sold: config[16].value,
          rate: config[17].value,
        },
        lazada: {
          item: config[19].value,
          thumbnail: config[20].value,
          url: config[21].value,
          name: config[22].value,
          salePrice: config[23].value,
          listPrice: config[24].value,
          discountPercent: config[25].value,
          rate: config[26].value,
        },
      };

      if (errors.length) throw new BadRequestException(errors.join(';'));
      return { crawlUrl, crawlConfig };
    } catch (error) {
      this.logger.error(`${this.getCrawlConfig.name} Error:${error.message}`);
      throw new RpcException({ message: 'Thieu config vui long kiem tra lai', status: error.status || 500 });
    }
  }
}
