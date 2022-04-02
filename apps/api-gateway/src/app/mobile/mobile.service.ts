import { CMD } from '@aff-services/shared/utils/helpers';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class MobileService {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`API-Gateway.${MobileService.name}`);
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
    return this.client.send({ cmd: CMD.WELCOME_TO_USER }, {}).toPromise();
  }
}
