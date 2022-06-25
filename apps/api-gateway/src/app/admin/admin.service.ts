import { ConfigPayload } from '@aff-services/shared/models/dtos';
import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AdminService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${AdminService.name}`);
  constructor() {
    this.logger.log(`Connecting to: ${process.env.REDIS_URL}`);
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        url: process.env.REDIS_URL,
        retryAttempts: 3,
        retryDelay: 1000 * 30,
      },
    });
  }
  async getData(): Promise<{ message: string }> {
    return await this.client.send({ cmd: CMD.WELCOME_TO_USER }, {}).toPromise();
  }

  async getConfigs() {
    this.logger.log(`${this.getConfigs.name} called`);
    return this.client.send({ cmd: CMD.ADMIN_GET_CONFIG }, {}).toPromise();
  }

  async createConfig(data: ConfigPayload) {
    this.logger.log(`${this.createConfig.name} called`);
    return this.client.send({ cmd: CMD.ADMIN_CREATE_CONFIG }, data).toPromise();
  }

  async updateConfig(data: ConfigPayload) {
    this.logger.log(`${this.updateConfig.name} called`);
    return this.client.send({ cmd: CMD.ADMIN_UPDATE_CONFIG }, data).toPromise();
  }

  async deleteConfig(configName: string) {
    this.logger.log(`${this.deleteConfig.name} called`);
    return this.client.send({ cmd: CMD.ADMIN_DELETE_CONFIG }, { configName }).toPromise();
  }

  async getFinaceReport() {
    this.logger.log(`${this.getFinaceReport.name} called`);
    return this.client.send({ cmd: CMD.ADMIN_GET_FINACE_REPORT }, { }).toPromise();
  }
}
