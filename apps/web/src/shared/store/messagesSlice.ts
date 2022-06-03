import {
  Record,
  String,
  Static,
  Number,
  Union,
  Literal,
  Array,
  Null,
} from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GenericState } from './genericSlice'
import { CurrentDialogExisting, CurrentDialogNew } from './dialogsSlice'
import { ClientError, DialogId } from 'shared/config'

export enum ChatMessageEvent {
  SendMessage = 'send_message',
  RequestAllMessages = 'request_all_messages',
  SendAllMessages = 'send_all_messages',
  ReceiveMessage = 'receive_message',
}

const OwnerSchema = Union(Literal('own'), Literal('theirs'))
export type MessageOwner = Static<typeof OwnerSchema>

const RawMessageSchema = Record({
  id: Number,
  createdAt: String,
  content: String,
  authorId: String,
  receiverId: String.optional(),
  conversationId: Number,
})
export type RawMessage = Static<typeof RawMessageSchema>
const RawMessagesArrSchema = Array(RawMessageSchema)

export type Message = {
  id: number
  createdAt: string
  content: string
  authorId: string
  receiverId?: string
  dialogId: number
}

interface MessageData {
  messages: Message[]
}
interface MessageState extends GenericState<MessageData> {}

const initialState: MessageState = {
  data: {
    messages: [],
  },
  status: 'idle',
}

const messagesSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    receiveAllMessages: (
      state,
      action: PayloadAction<{
        messages: RawMessage[]
      }>,
    ) => {
      const messages = action.payload.messages
      const isMessagesArr = RawMessagesArrSchema.guard(messages)
      if (!isMessagesArr) {
        const error: ClientError = {
          type: 'ERROR_BACKEND_REQUEST_VALIDATION',
          date: new Date(),
          message:
            '[Receive all messages] Fetched messages format is wrong' +
            JSON.stringify(messages, null, 2),
          details:
            'Array of ' +
            JSON.stringify({
              id: 'Number',
              createdAt: 'String',
              content: 'String',
              authorId: 'String',
              conversationId: 'Number',
            }),
        }

        console.error(error)
        state.data.messages = []
        return
      }
      state.data.messages = messages.map(message =>
        rawMessageToMessage(message),
      )
      state.status = 'idle'
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        message: RawMessage
      }>,
    ) => {
      state.data.messages.push(rawMessageToMessage(action.payload.message))
      state.status = 'idle'
    },
    submitMessage: (
      state,
      action: PayloadAction<{
        currentDialog: CurrentDialogExisting | CurrentDialogNew
        content: string
      }>,
    ) => {
      state.status = 'loading'
      return
    },
    getAllMessages: (
      state,
      action: PayloadAction<{
        dialogId: DialogId
      }>,
    ) => {
      state.status = 'loading'
      return
    },
  },
})

export const messagesActions = messagesSlice.actions
export default messagesSlice.reducer

const rawMessageToMessage = (message: RawMessage): Message => {
  return {
    id: message.id,
    createdAt: message.createdAt,
    content: message.content,
    authorId: message.authorId,
    receiverId: message.receiverId,
    dialogId: message.conversationId,
  }
}
