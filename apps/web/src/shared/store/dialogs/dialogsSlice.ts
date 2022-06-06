import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ClientError } from 'shared/config'
import { GenericState } from '../types'
import {
  CurrentDialogPayload,
  RawDialog,
  RawDialogArrSchema,
  Dialog,
  DialogTypes,
} from './types'
import { rawDialogToDialog } from './model'

interface DialogData {
  currentDialog: CurrentDialogPayload
  dialogs: Dialog[]
}

interface DialogState extends GenericState<DialogData> {}

const initialState: DialogState = {
  data: {
    currentDialog: {
      type: DialogTypes.NO_DIALOG,
      id: null,
    },
    dialogs: [],
  },
  status: 'idle',
}

const dialogsSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    receiveAllDialogs: (
      state,
      action: PayloadAction<{
        dialogs: RawDialog[]
      }>,
    ) => {
      const dialogs = action.payload.dialogs
      const isDialogsArr = RawDialogArrSchema.guard(dialogs)
      if (!isDialogsArr) {
        const error: ClientError = {
          type: 'ERROR_BACKEND_REQUEST_VALIDATION',
          date: new Date(),
          message:
            '[Receive all dialogs] Fetched dialogs format is wrong' +
            JSON.stringify(dialogs),
          details:
            'Array of ' +
            JSON.stringify({
              id: 'Number',
              user: {
                id: 'String',
                name: 'String',
                avatar: 'String.Or(Null)',
              },
              message: {
                id: 'Number',
                content: 'String',
                createdAt: 'String',
              },
            }),
        }
        state.data.dialogs = []
        console.error(error)
        state.status = 'error'
        return
      }
      state.data.dialogs = dialogs.map(rawDialogToDialog)
      state.status = 'idle'
    },
    getAllDialogs: state => {
      state.status = 'loading'
      return
    },
    setCurrentDialog: (state, action: PayloadAction<CurrentDialogPayload>) => {
      state.data.currentDialog = action.payload
    },
  },
})

export const dialogsActions = dialogsSlice.actions
export default dialogsSlice.reducer
