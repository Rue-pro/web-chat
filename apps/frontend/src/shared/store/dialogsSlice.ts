import { Record, String, Static, Number, Array, Null } from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GenericState } from './genericSlice'

export type DialogId = number | null
export const DialogUserSchema = Record({
  id: String,
  name: String,
  avatar: String,
})
export const DialogMessageSchema = Record({
  id: Number,
  content: String,
  createdAt: String,
})
const DialogSchema = Record({
  id: Number.Or(Null),
  user: DialogUserSchema,
  message: DialogMessageSchema,
})
const DialogArrSchema = Array(DialogSchema)
export type Dialog = Static<typeof DialogSchema>

interface DialogData {
  currentDialogId: DialogId
  dialogs: Dialog[]
}
interface DialogState extends GenericState<DialogData> {}

const initialState: DialogState = {
  data: {
    currentDialogId: null,
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
    setCurrentDialog: (
      state,
      action: PayloadAction<{
        dialogId: DialogId
      }>,
    ) => {
      console.log('SETTING_CURRENT_DIALOG', action)
      state.data.currentDialogId = action.payload.dialogId
    },
  },
})

export const dialogsActions = dialogsSlice.actions
export default dialogsSlice.reducer
