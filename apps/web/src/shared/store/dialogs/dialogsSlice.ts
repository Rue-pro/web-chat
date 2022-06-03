import { Record, Static, Number, Array } from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GenericState } from '../genericSlice'
import {
  CurrentDialogPayload,
  RawDialog,
  RawDialogArrSchema,
  Dialog,
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
      type: 'NO_DIALOG',
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
        console.error(
          'Fetched through socket dialogs format is wrong!',
          dialogs,
        )
        state.data.dialogs = []
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
