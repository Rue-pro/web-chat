import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ClientError, DialogId } from 'shared/config'
import { GenericState } from '../types'
import { CurrentDialogExisting, CurrentDialogNew } from '../dialogs/types'
import {
  Message,
  RawMessage,
  RawMessagesArrSchema,
  RawMessageSchema,
} from './types'
import { rawMessageToMessage } from './model'

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
      const isRawMessagesArr = RawMessagesArrSchema.guard(messages)
      if (!isRawMessagesArr) {
        const error: ClientError = {
          type: 'ERROR_BACKEND_REQUEST_VALIDATION',
          date: new Date(),
          message:
            '[Receive all messages] Fetched messages format is wrong' +
            JSON.stringify(messages),
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
        state.data.messages = []
        console.error(error)
        return
      }

      state.data.messages = messages.map(rawMessageToMessage)
      state.status = 'idle'
    },
    receiveMessage: (
      state,
      action: PayloadAction<{
        message: RawMessage
      }>,
    ) => {
      const message = action.payload.message
      const isRawMessage = RawMessageSchema.guard(message)
      if (!isRawMessage) {
        const error: ClientError = {
          type: 'ERROR_BACKEND_REQUEST_VALIDATION',
          date: new Date(),
          message:
            '[Receive message] Fetched message format is wrong' +
            JSON.stringify(message),
          details: '',
        }
        console.error(error)
        state.status = 'error'
        return
      }

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
