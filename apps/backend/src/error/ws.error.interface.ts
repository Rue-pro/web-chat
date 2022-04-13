import { Socket } from 'dgram';

export class IWSError {
  message: {
    name: string;
    content: string;
  };
  code: number;
  timestamp: string;
  method: string;

  constructor({
    code,
    message,
    name,
  }: {
    code: number;
    message: string;
    name: string;
  }) {
    this.code = code;
    this.message = {
      name: name,
      content: message,
    };
    this.timestamp = new Date().toISOString();
    this.method = 'ws';
  }
}
