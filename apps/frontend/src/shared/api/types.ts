import { Record, String, Static, Number } from 'runtypes'

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default'

export enum ChatEvent {
  SendMessage = 'send_message',
  RequestAllMessages = 'request_all_messages',
  SendAllMessages = 'send_all_messages',
  ReceiveMessage = 'receive_message',
}

export type Toast = {
  type: ToastType
  content: string
}

export type AvatarExtension = 'jpg' | 'png' | 'gif'

export type Avatar = {
  path: string
  extension: AvatarExtension
  alt: string
}

export const UserScheme = Record({
  id: String,
  name: String,
  /**
   * TODO
   * Make avatar type looks like
   * {
   *  path: string
   *  extension: 'jpg' | 'png' | 'gif'
   * }
   */
  avatar: String,
})

export type User = Static<typeof UserScheme>

export const MessageSheme = Record({
  id: Number,
  authorId: String,
  content: String,
})

export type Message = Static<typeof MessageSheme>

export const SessionScheme = Record({
  accessToken: String,
  refreshToken: String,
})

export type Session = Static<typeof SessionScheme>
