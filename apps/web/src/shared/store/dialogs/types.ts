import { Record, String, Number, Null, Static, Array } from 'runtypes'
import { DialogId } from 'shared/config'

export type NewDialogId = string
export type CurrentDialogId = DialogId | NewDialogId | null

export const RawDialogUserSchema = Record({
  id: String,
  name: String,
  avatar: String.Or(Null),
})
export const RawDialogMessageSchema = Record({
  id: Number,
  content: String,
  createdAt: String,
})
export const RawDialogSchema = Record({
  id: Number,
  user: RawDialogUserSchema,
  message: RawDialogMessageSchema,
})
export const RawDialogArrSchema = Array(RawDialogSchema)
export type RawDialog = Static<typeof RawDialogSchema>

export enum DialogTypes {
  EXISTING_DIALOG,
  NEW_DIALOG,
  NO_DIALOG,
}
export interface CurrentDialogExisting {
  type: DialogTypes.EXISTING_DIALOG
  id: number
}
export interface CurrentDialogNew {
  type: DialogTypes.NEW_DIALOG
  id: string
}
interface NoCurrentDialog {
  type: DialogTypes.NO_DIALOG
  id: null
}
export type CurrentDialogPayload =
  | CurrentDialogExisting
  | CurrentDialogNew
  | NoCurrentDialog

export interface Dialog {
  id: DialogId
  user: {
    id: string
    name: string
    avatar: string
  }
  message: {
    id: number
    content: string
    createdAt: Date
  }
}
