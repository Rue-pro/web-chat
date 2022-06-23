import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { generateWrongFetchedFormatError } from 'shared/lib'
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
      _action: PayloadAction<{
        dialogs: RawDialog[]
      }>,
    ) => {
      const dialogs = _action.payload.dialogs
      const isDialogsArr = RawDialogArrSchema.guard(dialogs)
      if (!isDialogsArr) {
        const error = generateWrongFetchedFormatError({
          query: 'Receive all dialogs',
          entity: 'dialogs',
          res: dialogs,
          expectedType: RawDialogArrSchema,
        })
        console.error(error)
        state.data.dialogs = []
        state.status = 'idle'
        return
      }
      state.data.dialogs = dialogs.map(rawDialogToDialog)
      state.status = 'idle'
    },
    getAllDialogs: state => {
      state.status = 'loading'
    },
    setCurrentDialog: (state, action: PayloadAction<CurrentDialogPayload>) => {
      state.data.currentDialog = action.payload
    },
  },
})

export const dialogsActions = dialogsSlice.actions
export default dialogsSlice.reducer
