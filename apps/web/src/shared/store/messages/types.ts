import { Record, String, Static, Number, Union, Literal, Array } from 'runtypes'
import { MessageId } from 'shared/config'

export enum ChatMessageEvent {
  SendMessage = 'send_message',
  RequestAllMessages = 'request_all_messages',
  SendAllMessages = 'send_all_messages',
  ReceiveMessage = 'receive_message',
}

const OwnerSchema = Union(Literal('own'), Literal('theirs'))
export type MessageOwner = Static<typeof OwnerSchema>

export const RawMessageSchema = Record({
  id: Number,
  createdAt: String,
  content: String,
  authorId: String,
  receiverId: String.optional(),
  conversationId: Number,
})
export type RawMessage = Static<typeof RawMessageSchema>
export const RawMessagesArrSchema = Array(RawMessageSchema)

export type Message = {
  id: MessageId
  createdAt: Date
  content: string
  authorId: string
  receiverId?: string
  dialogId: number
}
