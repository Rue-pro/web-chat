import { Record, Static, Number, Array } from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DialogId, DialogMessageSchema, DialogUserSchema } from 'shared/config'
import { GenericState } from './genericSlice'

export type NewDialogId = string
export type CurrentDialogId = DialogId | NewDialogId | null

const DialogSchema = Record({
  id: Number,
  user: DialogUserSchema,
  message: DialogMessageSchema,
})
const DialogArrSchema = Array(DialogSchema)
export type Dialog = Static<typeof DialogSchema>

export interface CurrentDialogExisting {
  type: 'EXISTING_DIALOG'
  id: number
}
export interface CurrentDialogNew {
  type: 'NEW_DIALOG'
  id: string
}
interface NoCurrentDialog {
  type: 'NO_DIALOG'
  id: null
}
export type CurrentDialogPayload =
  | CurrentDialogExisting
  | CurrentDialogNew
  | NoCurrentDialog

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
        dialogs: Dialog[]
      }>,
    ) => {
      console.log('RECEIVE_ALL_DIALOGS', action)
      const dialogs = action.payload.dialogs
      const isDialogsArr = DialogArrSchema.guard(dialogs)
      if (!isDialogsArr) {
        console.error('Fetched through socket dialogs format is wrong!')
        state.data.dialogs = []
        return
      }
      state.data.dialogs = dialogs
      state.status = 'idle'
    },
    getAllDialogs: (
      state,
      action: PayloadAction<{
        userId: string
      }>,
    ) => {
      console.log('REQUEST_FOR_ALL_DIALOGS', action)
      state.status = 'loading'
      return
    },
    setCurrentDialog: (state, action: PayloadAction<CurrentDialogPayload>) => {
      console.log('SETTING_CURRENT_DIALOG', action)
      state.data.currentDialog = action.payload
    },
  },
})

export const dialogsActions = dialogsSlice.actions
export default dialogsSlice.reducer
