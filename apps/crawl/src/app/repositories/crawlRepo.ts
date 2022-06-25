import { CRAWL_HISTORY, CRAWL_PRODUCT_HISTORY } from '@aff-services/shared/models/entities';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CrawlRepo {
  private readonly logger = new Logger(`Micro-Crawl.${CrawlRepo.name}`);
  constructor(
    @Inject('CRAWL_HISTORY_REPOSITORY') private readonly crawlRepo: Repository<CRAWL_HISTORY>,
    @Inject('CRAWL_PRODUCT_HISTORY_REPOSITORY')
    private readonly crawlProductHistoryRepo: Repository<CRAWL_PRODUCT_HISTORY>
  ) {}

  async create() {
    return await this.crawlRepo
      .createQueryBuilder()
      .insert()
      .into(CRAWL_HISTORY)
      .values({ status: 'pending', createdAt: new Date(), updatedAt: new Date() })
      .execute();
  }

  async updateToCrawling(id: number) {
    return await this.crawlRepo
      .createQueryBuilder()
      .update(CRAWL_HISTORY)
      .set({ status: 'crawling' })
      .where('crawl_history_id = :id', { id })
      .execute();
  }

  async updateToDone(id: number) {
    return await this.crawlRepo
      .createQueryBuilder()
      .update(CRAWL_HISTORY)
      .set({ status: 'done' })
      .where('crawl_history_id = :id', { id })
      .execute();
  }

  async endSession(id: number) {
    try {
      return await this.crawlProductHistoryRepo
        .createQueryBuilder()
        .update(CRAWL_PRODUCT_HISTORY)
        .set({ status: 'done' })
        .where('crawl_history_id = :id and status != :status', { id, status: 'crawling' })
        .execute();
    } catch (error) {
      this.logger.error(`${(this, this.endSession.name)} Error`);
    }
  }

  async updateLineToCrawling(crawlHistoryId: number, productId: string) {
    try {
      return await this.crawlProductHistoryRepo
        .createQueryBuilder()
        .update(CRAWL_PRODUCT_HISTORY)
        .set({ status: 'crawling' })
        .where('crawl_history_id = :crawlHistoryId and product_id = :productId', { crawlHistoryId, productId })
        .execute();
    } catch (error) {
      this.logger.error(`${(this, this.updateLineToCrawling.name)} Error`);
    }
  }

  async updateLineToDone(crawlHistoryId: number, productId: string) {
    try {
      return await this.crawlProductHistoryRepo
        .createQueryBuilder()
        .update(CRAWL_PRODUCT_HISTORY)
        .set({ status: 'done' })
        .where('crawl_history_id = :crawlHistoryId and product_id = :productId', { crawlHistoryId, productId })
        .execute();
    } catch (error) {
      this.logger.error(`${(this, this.updateLineToCrawling.name)} Error`);
    }
  }

  async getAll() {
    this.logger.log(`${this.getAll.name} called`);
    return await this.crawlRepo.createQueryBuilder('c').getMany();
  }

  // async createOne() {
  //   this.logger.log(`${this.createOne.name} called`);
  //   return await this.crawlRepo.save();
  // }

  async getOneById(id: number) {
    this.logger.log(`${this.getOneById.name} called Id:${id}`);
    return this.crawlRepo
      .createQueryBuilder('ch')
      .where('1=1')
      .andWhere('ch.crawl_history_id = :id')
      .setParameters({ id })
      .getOneOrFail();
  }

  async insertIntoCrawlProductHistory(data: any) {
    return await this.crawlProductHistoryRepo
      .createQueryBuilder()
      .insert()
      .into(CRAWL_PRODUCT_HISTORY)
      .values(data)
      // .orUpdate([],['crawl_history_id','product_id'])
      .orIgnore()
      .execute();
  }

  async getListCrawlProductDetail(crawlHistoryId: number) {
    const [data, total] = await this.crawlProductHistoryRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.product', 'p')
      .where('1=1')
      .andWhere('c.crawl_history_id = :crawlHistoryId')
      .setParameters({ crawlHistoryId })
      .getManyAndCount();
    return { total, data };
  }

  async updateProductToCrawling(crawlHistoryId: number, productId: string) {
    return this.crawlProductHistoryRepo
      .createQueryBuilder('c')
      .update(CRAWL_PRODUCT_HISTORY)
      .set({ status: 'crawling' })
      .andWhere('c.crawl_history_id = :crawlHistoryId')
      .andWhere('c.product_id = :productId')
      .setParameters({ crawlHistoryId, productId })
      .execute();
  }
}
