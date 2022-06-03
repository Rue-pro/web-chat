export type ServerError = {
  message: string
  name: string
}

export type ClientError = {
  date: Date
  message: string
  details: string
  type: 'ERROR_NO_TAG' | 'ERROR_BACKEND_REQUEST_VALIDATION'
}

export type UserId = string

export type MessageId = string

export type DialogId = number
