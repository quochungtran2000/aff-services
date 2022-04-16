import { Injectable, NestMiddleware, Logger, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/configurations';
@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  /**
   * Verify the requests header on api-gateway
   *
   * @param request - The request
   * @param response - The response
   * @param next - The next function
   */
  private readonly logger = new Logger(`API-Gateway.${HeaderMiddleware.name}`);

  use(request: Request, response: Response, next: NextFunction): void {
    const headers = request.headers;
    if (
      headers['x-application-name'] &&
      headers['x-private-key']
    ) {

      const applications = config.env.applications.split(';');
      const APPLICATIONS = [];
      applications.forEach(clientApp => {
        if (clientApp && clientApp !== '') {
          APPLICATIONS.push(clientApp);
        }
      });
      if (
        headers['x-private-key'] !==
        config.env.privateKey ||
        APPLICATIONS.indexOf(headers['x-application-name'].toString()) < 0
      ) {

        throw new BadRequestException(`Bad Request`);
      }
      response.header('Access-Control-Allow-Credentials', 'true');
      response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      next();
    } else {
      const url = request.baseUrl;
      if (url.indexOf('health') > -1) next();
      else
        throw new BadRequestException(`Bad Request`);
    }
  }
}
