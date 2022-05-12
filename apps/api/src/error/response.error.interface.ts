export interface IResponseError {
  statusCode: number;
  message: {
    name: string;
    content: string;
  };
  code: string;
  timestamp: string;
  path: string;
  method: string;
}
