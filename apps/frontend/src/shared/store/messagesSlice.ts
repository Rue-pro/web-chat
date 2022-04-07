import { Record, String, Static, Number, Union, Literal, Array } from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum ChatEvent {
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
  owner: OwnerSchema,
})
const MessagesArrSchema = Array(MessageSchema)
export type MessageOwner = Static<typeof OwnerSchema>
export type Message = Static<typeof MessageSchema>

interface ChatState {
  isEstablishingConnection: boolean
  isConnected: boolean
  messages: Message[]
}

const initialState: ChatState = {
  isEstablishingConnection: false,
  isConnected: false,
  messages: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    startConnecting: state => {
      state.isEstablishingConnection = true
    },
    connectionEstablished: state => {
      state.isConnected = true
      state.isEstablishingConnection = true
    },
    receiveAllMessages: (
      state,
      action: PayloadAction<{
        messages: Message[]
      }>,
    ) => {
      console.log('MESSAGES_SLICE_RECEIVE_ALL_MESSAGES', action)
      const messages = action.payload.messages
      const isMessagesArr = MessagesArrSchema.guard(messages)
      if (!isMessagesArr) {
        console.error('Fetched through socket messages format is wrong!')
        state.messages = []
      }
      state.messages = messages
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        message: Message
      }>,
    ) => {
      state.messages.push(action.payload.message)
    },
    submitMessage: (
      state,
      action: PayloadAction<{
        content: string
      }>,
    ) => {
      return
    },
    getAllMessages: (
      state,
      action: PayloadAction<{
        userId: string
      }>,
    ) => {
      return
    },
  },
})

export const chatActions = chatSlice.actions
export default chatSlice.reducer
