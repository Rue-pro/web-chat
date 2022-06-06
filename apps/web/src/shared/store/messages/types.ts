import { Record, String, Static, Number, Union, Literal, Array } from 'runtypes'
import { MessageId } from 'shared/config'

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
  createdAt: string
  content: string
  authorId: string
  receiverId?: string
  dialogId: number
}
