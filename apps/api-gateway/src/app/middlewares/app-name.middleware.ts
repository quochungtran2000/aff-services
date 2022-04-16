import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AppNameMiddleWare implements NestMiddleware {
  /**
   * Verify the requests header on jwt token and header application name
   *
   * @param request - The request
   * @param response - The response
   * @param next - The next function
   */
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      const headers = req.headers;
      if (headers['x-application-name'] && headers['authorization']) {
        const token = headers['authorization'].replace('Bearer ', '');
        const { appName }: any = this.jwtService.decode(token);
        if (headers['x-application-name'] !== appName) {
          throw new BadRequestException(`Bad Request`);
        }
        next();
      } else {
        throw new BadRequestException(`Bad Request`);
      }
    } catch (error) {
      throw new BadRequestException(`Bad Request`);
    }
  }
}
