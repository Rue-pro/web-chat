import { Record, String, Static, Number, Array, Null } from 'runtypes'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GenericState } from './genericSlice'

export type DialogId = number | null
export type ReceiverId = string | null

export const DialogUserSchema = Record({
  id: String,
  name: String,
  avatar: String.Or(Null),
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

export interface CurrentDialogPayload {
  dialogId: DialogId
  receiverId?: ReceiverId
}
interface DialogData {
  currentDialog: {
    id: DialogId
    receiverId: ReceiverId
  }
  dialogs: Dialog[]
}
interface DialogState extends GenericState<DialogData> {}

const initialState: DialogState = {
  data: {
    currentDialog: {
      id: null,
      receiverId: null,
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
      state.data.currentDialog.id = action.payload.dialogId
      state.data.currentDialog.receiverId = action.payload.receiverId ?? null
    },
  },
})

export const dialogsActions = dialogsSlice.actions
export default dialogsSlice.reducer
