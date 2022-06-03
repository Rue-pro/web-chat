import { RawDialog, Dialog } from './types'

export const rawDialogToDialog = (dialog: RawDialog): Dialog => {
  return {
    id: dialog.id,
    user: {
      id: dialog.user.id,
      name: dialog.user.name,
      avatar: dialog.user.avatar,
    },
    message: {
      id: dialog.message.id,
      content: dialog.message.content,
      createdAt: new Date(dialog.message.createdAt),
    },
  }
}
