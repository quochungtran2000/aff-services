import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function SwaggerHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-application-name',
      description: 'AFF-Services application name',
    }),
    ApiHeader({
      name: 'x-private-key',
      description: 'AFF-Services private key',
    }),
    ApiHeader({
      name: 'authorization',
      description: 'Bearer Token',
    })
  );
}

export function SwaggerNoAuthHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-application-name',
      description: 'AFF-Services application name',
    }),
    ApiHeader({
      name: 'x-private-key',
      description: 'AFF-Services private key',
    })
  );
}

export function SwaggerException() {
  return applyDecorators(
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request!',
    }),
    ApiNotFoundResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found!',
    }),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error!',
    }),
    ApiUnauthorizedResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'UnAuthorized!',
    })
  );
}

export function SwaggerNoAuthException() {
  return applyDecorators(
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request!',
    }),
    ApiNotFoundResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found!',
    }),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal Server Error!',
    })
  );
}
