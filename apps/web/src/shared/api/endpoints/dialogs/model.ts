import { RawSearchDialog, SearchDialog } from './types'

export const rawDialogToDialog = (dialog: RawSearchDialog): SearchDialog => {
  return {
    id: dialog.id,
    user: {
      id: dialog.user.id,
      name: dialog.user.name,
      avatar: dialog.user.avatar ?? '',
    },
    message: {
      id: dialog.message?.id ?? null,
      content: dialog.message?.content ?? '',
      createdAt: dialog.message?.createdAt
        ? new Date(dialog.message.createdAt)
        : null,
    },
  }
}
