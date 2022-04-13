import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CannotCreateEntityIdMapError,
  EntityNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { GlobalResponseError } from './global.response.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('GLOBAL_HTTP_EXCEPTION_FILTER', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;
    let code = 'HttpException';
    let errorName = '';

    Logger.error(
      message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    if (exception.constructor === QueryFailedError) {
      // this is a TypeOrm error
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as QueryFailedError).message;
      code = (exception as any).code;
    }

    if (exception.constructor === EntityNotFoundError) {
      // this is another TypeOrm error
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as EntityNotFoundError).message;
      code = (exception as any).code;
    }

    if (exception.constructor === CannotCreateEntityIdMapError) {
      // and another
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as CannotCreateEntityIdMapError).message;
      code = (exception as any).code;
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorName = exception.name;
    }

    response
      .status(status)
      .send(GlobalResponseError(status, message, code, errorName, request));
  }
}
