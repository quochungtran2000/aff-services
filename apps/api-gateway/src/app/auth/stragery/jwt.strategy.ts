import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { config } from '../../config/configurations';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly client: ClientProxy;
  private readonly logger = new Logger(`Api-Gateway.${JwtStrategy.name}`);
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
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

  async validate(payload: any) {
    this.logger.log(`${this.validate.name} ${JSON.stringify(payload)}`);
    const data = await this.client
      .send({ cmd: 'my_profile' }, { userId: payload.userId })
      .toPromise()
      .catch(() => {
        throw new UnauthorizedException();
      });

    if (!data) throw new UnauthorizedException();

    return data;
  }
}
