import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.Admin.${AppService.name}`);
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
    return this.client.send({ cmd: 'a' }, {}).toPromise();
  }

  async getUser(data: any = {}) {
    this.logger.log(`${this.getUser.name} called`);
    return this.client.send({ cmd: 'find_user' }, data).toPromise();
  }
}
