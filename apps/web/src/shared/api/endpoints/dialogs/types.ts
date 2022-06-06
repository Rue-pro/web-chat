import { Record, Static, Number, Array, Optional } from 'runtypes'
import { DialogId } from 'shared/config'

import {
  RawDialogMessageSchema,
  RawDialogUserSchema,
} from 'shared/store/dialogs/types'

export type Query = string

const RawSearchDialogSchema = Record({
  id: Optional(Number),
  user: RawDialogUserSchema,
  message: Optional(RawDialogMessageSchema),
})

export const RawSearchDialogArrSchema = Array(RawSearchDialogSchema)

export type RawSearchDialog = Static<typeof RawSearchDialogSchema>

export interface SearchDialog {
  id?: DialogId
  user: {
    id: string
    name: string
    avatar: string
  }
  message: {
    id: number | null
    content: string
    createdAt: string | null
  }
}
