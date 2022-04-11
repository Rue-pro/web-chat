import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetDialogsQuery } from 'shared/api/endpoints/dialogsApi'
import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { timeStampToRuDate } from 'shared/lib'
import { TStore } from 'shared/store'
import { chatActions } from 'shared/store/messagesSlice'

interface DialogsProps {
  onOpenDialog: (dialogId: string) => void
  onLoadDialogs?: (dialogId: string | null) => void
  currentDialog: string | null
}

const Dialogs: React.FC<DialogsProps> = ({
  onOpenDialog,
  onLoadDialogs,
  currentDialog,
}) => {
  const dispatch = useDispatch()
  const { status, messages, userId } = useSelector((state: TStore) => {
    return {
      status: state.MessagesReducer.status,
      messages: state.MessagesReducer.dialogs,
      userId: state.AuthReducer.data.userId,
    }
  })
  console.log('DIALOGS_COMPONENT', messages)
  const { data: dialogs, isLoading } = useGetDialogsQuery()

  useEffect(() => {
    dispatch(chatActions.getAllDialogs({ userId: userId }))
  }, [dispatch, userId])

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
          sentTime={timeStampToRuDate(dialog.message?.createdAt ?? '')}
          unreadedMessagesCount={1000}
          onClick={() => {
            onOpenDialog(dialog.user.id)
          }}
          isCurrent={currentDialog === dialog.user.id}
        />
      ))}
    </>
  )
}

export default Dialogs
