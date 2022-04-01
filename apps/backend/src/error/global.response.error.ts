import { FastifyRequest } from 'fastify';
import { IResponseError } from './response.error.interface';

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: FastifyRequest,
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: FastifyRequest,
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
