import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.warn('ERROR:', exception.code);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    switch (exception.code) {
      case 'P2002':
        response.code(HttpStatus.CONFLICT);
        response.send({
          statusCode: HttpStatus.CONFLICT,
          message: exception.message.replace(/\n/g, ''),
        });
        break;
      default:
        super.catch(exception, host);
    }
  }
}
