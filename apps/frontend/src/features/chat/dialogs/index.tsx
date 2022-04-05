import React, { useEffect } from 'react'

import { useGetDialogsQuery } from 'shared/api/endpoints/dialogsApi'
import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'

interface DialogsProps {
  onOpenDialog: (dialogId: string) => void
  onLoadDialogs?: (dialogId: string | null) => void
}

const Dialogs: React.FC<DialogsProps> = ({ onOpenDialog, onLoadDialogs }) => {
  const { data: dialogs, isLoading } = useGetDialogsQuery()

  useEffect(() => {
    if (onLoadDialogs) {
      if (dialogs?.length) {
        onLoadDialogs(dialogs[0].user.id)
      } else {
        onLoadDialogs(null)
      }
    }
  }, [dialogs, onLoadDialogs])

  if (isLoading) {
    return (
      <DialogLoadingTemplate
        skeleton={<DialogRowSketeton />}
        skeletonsCount={6}
      />
    )
  }

  return (
    <>
      {/*  TODO unreadedMessagesCount={1000} */}
      {dialogs?.map(dialog => (
        <DialogRow
          key={dialog.user.id}
          id={dialog.user.id}
          avatar={{
            src: dialog.user.avatar,
            alt: dialog.user.name,
            isOnline: true,
          }}
          title={dialog.user.name}
          message={dialog.message?.content ?? ''}
          sentTime={dialog.message?.createdAt ?? ''}
          unreadedMessagesCount={1000}
          onClick={() => {
            onOpenDialog(dialog.user.id)
          }}
        />
      ))}
    </>
  )
}

export default Dialogs
