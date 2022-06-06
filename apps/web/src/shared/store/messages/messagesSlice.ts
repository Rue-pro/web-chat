import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DialogId } from 'shared/config'
import { generateWrongFetchedFormatError } from 'shared/lib'
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
        const error = generateWrongFetchedFormatError({
          query: 'Receive all messages',
          entity: 'messages',
          res: messages,
          expectedType: RawMessagesArrSchema,
        })
        console.error(error)
        state.status = 'idle'
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
        const error = generateWrongFetchedFormatError({
          query: 'Receive message',
          entity: 'message',
          res: message,
          expectedType: RawMessageSchema,
        })
        console.error(error)
        state.status = 'idle'
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
    resetAllMessages(state) {
      state.data.messages = []
    },
  },
})

export const messagesActions = messagesSlice.actions
export default messagesSlice.reducer
