import { ConfigPayload, UpdateUserDTO, UserQuery } from '@aff-services/shared/models/dtos';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { UserRepo } from '../repositories/userRepo';
import { v2 as cloudinary } from 'cloudinary';
import { RpcException } from '@nestjs/microservices';
import { ConfigRepo } from '../repositories/configRepo';

cloudinary.config({
  cloud_name: 'hunghamhoc',
  api_key: '879146363472782',
  api_secret: 'QXzmcJ8YTysTEXVWvzOPvH_Yi9k',
  secure: true,
});

@Injectable()
export class UserService {
  private readonly logger = new Logger(`Micro-User.${UserService.name}`);
  constructor(
    private readonly userRepo: UserRepo,
    private readonly configRepo: ConfigRepo,
    private readonly httpService: HttpService
  ) {}

  async adminGetUsers(query: UserQuery) {
    this.logger.log(`${this.adminGetUsers.name} called`);
    return this.userRepo.getUsers(query);
  }

  async uploadFile(file: any) {
    console.log({ file });
    try {
      const data = Buffer.from(file.buffer).toString('base64');
      const result = cloudinary.uploader.upload(`data:image/png;base64,${data}`, {
        filename_override: `thumbnail_${Date.now()}`,
        public_id: `thumbnail_${Date.now()}`,
        type: '',
        folder: 'aff_thumbnail',
      });

      return result;
    } catch (error) {
      console.log(error.message);
      throw new RpcException({ message: error.message, status: error.status || 500 });
    }
  }

  async updateUser(data: UpdateUserDTO) {
    return await this.userRepo.updateUser(data);
  }

  async getConfigs() {
    this.logger.log(`${this.getConfigs.name} called`);
    return await this.configRepo.getConfigs();
  }

  async createConfig(data: ConfigPayload) {
    this.logger.log(`${this.createConfig.name} called`);
    return await this.configRepo.createConfig(data);
  }

  async updateConfig(data: ConfigPayload) {
    this.logger.log(`${this.updateConfig.name} called`);
    return await this.configRepo.updateConfig(data);
  }

  async deleteConfig(configName: string) {
    this.logger.log(`${this.deleteConfig.name} called`);
    return await this.configRepo.deleteConfig(configName);
  }

  async adminGetFinanceReport() {
    const apiKey = await this.configRepo.getOneByName('access_trader_api_key');
    const accessTraderApi = await this.configRepo.getOneByName('access_trader_api');
    const lazadaCampaignId = await this.configRepo.getOneByName('lazada_campaign_id');
    const shopeeCampaignId = await this.configRepo.getOneByName('shopee_campaign_id');
    const tikiCampaignId = await this.configRepo.getOneByName('tiki_campaign_id');

    const configRequest = {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    };
    const lazadaPromise = this.httpService
      .get(`${accessTraderApi}/commission_policies?camp_id=${lazadaCampaignId}`, configRequest)
      .toPromise()
      .then(({ data }) => data)
      .catch(() => {
        return { category: [], default: [], product: [] };
      });

    const shopeePromise = this.httpService
      .get(`${accessTraderApi}/commission_policies?camp_id=${shopeeCampaignId}`, configRequest)
      .toPromise()
      .then(({ data }) => data)
      .catch(() => {
        return { category: [], default: [], product: [] };
      });

    const tikiPromise = this.httpService
      .get(`${accessTraderApi}/commission_policies?camp_id=${tikiCampaignId}`, configRequest)
      .toPromise()
      .then(({ data }) => data)
      .catch(() => {
        return { category: [], default: [], product: [] };
      });

    const ordersPromise = this.httpService
      .get(`${accessTraderApi}/orders`, {
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      })
      .toPromise()
      .then(({ data }) => data)
      .catch(() => {
        return { data: [], total: 0, total_page: 0 };
      });

    const [tiki, shopee, lazada, commission] = await Promise.all([
      tikiPromise,
      shopeePromise,
      lazadaPromise,
      ordersPromise,
    ]);

    return { data: { tiki, shopee, lazada, commission } };
  }
}
