import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(`API-Gateway.${AllExceptionsFilter.name}`);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const error: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message: 'Internal server error',
          };
    const message = error?.message;
    this.logger.error(`[ERROR] ${JSON.stringify(message)}`);
    response.status(status).json({
      status: status,
      name: error?.name,
      message:
        status == HttpStatus.FORBIDDEN
          ? ['This user does not have permission']
          : typeof error?.message === 'object'
          ? [...message]
          : [message],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
