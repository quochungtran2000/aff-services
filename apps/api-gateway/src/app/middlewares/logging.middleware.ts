/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as ipaddr from 'ipaddr.js';
import * as requestIp from 'request-ip';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  /**
   * Logging all the requests and responses on api-gateway
   *
   * @param request - The request
   * @param response - The response
   * @param next - The next function
   */
  private readonly logger = new Logger(`API-Gateway.${LoggingMiddleware.name}`);

  use(request: Request, response: Response, next: NextFunction): void {
    const url = request.baseUrl;
    if (url.indexOf('health') < 0 && process.env.IS_LOGGER == 'Y') {
      const ipReq = requestIp.getClientIp(request);

      const oldWrite = response.write;
      const oldEnd = response.end;

      const chunks = [];

      //@ts-ignore
      response.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(response, restArgs);
      };

      response.end = (...restArgs) => {
        if (restArgs[0]) {
          chunks.push(Buffer.from(restArgs[0]));
        }
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        const dataLogs = {
          time: new Date().toISOString(),
          fromIP: request.headers['x-forwarded-for'] || ipaddr.process(ipReq).toString(),
          method: request.method,
          url: url,
          requestHeader: request.headers,
          requestBody: request.body,
          responseBody: body,
          userAgent: request.headers['user-agent'],
        };

        this.logger.log(process.env.NODE_ENV == 'development' ? dataLogs : JSON.stringify(dataLogs));

        oldEnd.apply(response, restArgs);
      };
    }
    next();
  }
}
