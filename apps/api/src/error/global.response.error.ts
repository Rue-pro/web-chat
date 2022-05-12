import { FastifyRequest } from 'fastify';
import { IResponseError } from './response.error.interface';

export const GlobalResponseError = (
  statusCode: number,
  message: string,
  code: string,
  name: string,
  request: FastifyRequest,
): IResponseError => {
  return {
    statusCode: statusCode,
    message: {
      name,
      content: message,
    },
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
  };
};
