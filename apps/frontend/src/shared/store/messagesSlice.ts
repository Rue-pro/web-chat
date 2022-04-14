import { Record, String, Static, Number, Union, Literal, Array } from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GenericState } from './genericSlice'

export enum ChatMessageEvent {
  SendMessage = 'send_message',
  RequestAllMessages = 'request_all_messages',
  SendAllMessages = 'send_all_messages',
  ReceiveMessage = 'receive_message',
}

const OwnerSchema = Union(Literal('own'), Literal('theirs'))
const MessageSchema = Record({
  id: Number,
  createdAt: String,
  content: String,
  authorId: String,
  dialogId: Number,
})
const MessagesArrSchema = Array(MessageSchema)
export type MessageOwner = Static<typeof OwnerSchema>
export type Message = Static<typeof MessageSchema>

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
        messages: Message[]
      }>,
    ) => {
      console.log('RECEIVE_ALL_MESSAGES', action)
      const messages = action.payload.messages
      const isMessagesArr = MessagesArrSchema.guard(messages)
      if (!isMessagesArr) {
        console.error('Fetched through socket messages format is wrong!')
        state.data.messages = []
        return
      }
      state.data.messages = messages
      state.status = 'idle'
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        message: Message
      }>,
    ) => {
      console.log('RECEIVING_MESSAGE', action)
      state.data.messages.push(action.payload.message)
      state.status = 'idle'
    },
    submitMessage: (
      state,
      action: PayloadAction<{
        dialogId: number
        receiverId: string
        content: string
      }>,
    ) => {
      console.log('SUBMIT_MESSAGE', action)
      state.status = 'loading'
      return
    },
    getAllMessages: (
      state,
      action: PayloadAction<{
        dialogId: number
      }>,
    ) => {
      console.log('REQUEST_FOR_ALL_MESSAGES', action)
      state.status = 'loading'
      return
    },
  },
})

export const messagesActions = messagesSlice.actions
export default messagesSlice.reducer
