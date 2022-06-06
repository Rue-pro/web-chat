export type ServerError = {
  message: string
  name: string
}

export enum ErrorTypes {
  ERROR_NO_TAG,
  ERROR_BACKEND_RESPONSE_VALIDATION,
}
export type ClientError = {
  date: Date
  message: string
  details: string
  type: ErrorTypes
}

export type UserId = string

export type MessageId = number

export type DialogId = number
