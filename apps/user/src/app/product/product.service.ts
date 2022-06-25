import { CrawlProductQuery, ProductTemplateQuery, SaveProductTemplateParamDTO } from '@aff-services/shared/models/dtos';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigRepo } from '../repositories/configRepo';
import { ProductRepo } from '../repositories/productRepo';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(`Micro-User.${ProductService.name}`);
  constructor(
    private readonly productRepo: ProductRepo,
    private configRepo: ConfigRepo,
    private httpService: HttpService
  ) {}

  async adminGetProduct(query: CrawlProductQuery) {
    this.logger.log(`${this.adminGetProduct.name} called`);
    return await this.productRepo.findAndCount(query);
  }

  async adminUpdateProductTemplate() {
    this.logger.log(`${this.adminGetProduct.name} called`);
    // return await this.productRepo.adminUpdateProductTemplate();
    return;
  }

  async admingetProductTemplate(data: ProductTemplateQuery) {
    this.logger.log(`${this.admingetProductTemplate.name} called`);
    return await this.productRepo.getProductTemplateV2(data);
  }

  async adminGetProductTemplateDetail(id: number) {
    this.logger.log(`${this.adminGetProductTemplateDetail.name} called`);
    return this.productRepo.getProductTemplateDetailV2(id);
  }

  async websiteGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.websiteGetProducts.name} called`);
    return await this.productRepo.getProductTemplateV2(data);
  }

  async websiteGetProduct(id: number) {
    this.logger.log(`${this.websiteGetProduct.name} called`);
    return await this.productRepo.getProductTemplateDetailV2(id);
  }

  async mobileGetProducts(data: ProductTemplateQuery) {
    this.logger.log(`${this.mobileGetProducts.name} called`);
    return await this.productRepo.getProductTemplateV2(data);
  }

  async mobileGetProduct(id: number) {
    this.logger.log(`${this.mobileGetProduct.name} called`);
    return await this.productRepo.getProductTemplateDetailV2(id);
  }

  async getEcommerceProductComment(productId: string) {
    this.logger.log(`${this.getEcommerceProductComment.name} called`);
    return await this.productRepo.getEcommerceProductComment(productId);
  }

  async userSaveProduct(data: SaveProductTemplateParamDTO) {
    this.logger.log(`${this.userSaveProduct.name} called`);
    return await this.productRepo.userSaveProduct(data);
  }

  async getSaveProduct(userId: number) {
    this.logger.log(`${this.getSaveProduct.name} called`);
    return await this.productRepo.getSaveProduct(userId);
  }

  async createAffLink(url: string) {
    const accessTraderAffLink = await this.configRepo.getOneByName('pub_create_aff_link');
    const accessTraderToken = await this.configRepo.getOneByName('access_trader_token');
    // const lazadaCampaignId = await this.configRepo.getOneByName('lazada_campaign_id');
    // const shopeeCampaignId = await this.configRepo.getOneByName('shopee_campaign_id');
    const tikiCampaignId = await this.configRepo.getOneByName('tiki_campaign_id');
    const trackingDomain = await this.configRepo.getOneByName('tracking_domain');
    const createShortenUrl = !!(await this.configRepo.getOneByName('create_shorten_url'));
    const payload = {
      campaign_id: tikiCampaignId,
      create_shorten: createShortenUrl,
      original_url: [url],
      tracking_domain: trackingDomain,
      utm_campaign: '',
      utm_content: '',
      utm_medium: '',
      utm_source: '',
    };

    const token = `Bearer ${accessTraderToken}`;

    const requestHeaders = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessTraderToken}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, authorization',
      },
    };

    console.log({ link: accessTraderAffLink, payload, token });
    const data = { link: accessTraderAffLink, payload, requestHeaders };
    const response = await this.httpService
      .post('http://localhost:1708/aff-link', data)
      .toPromise()
      .catch((err) => console.log(err));

    return response;
  }
}
