import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { timeStampToRuDate } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import { dialogsActions, Dialog } from 'shared/store/dialogsSlice'

interface DialogsProps {}

const Dialogs: React.FC<DialogsProps> = () => {
  const dispatch = useDispatch<TDispatch>()
  const { status, dialogs, userId, currentDialogId } = useSelector(
    (state: TStore) => {
      return {
        status: state.DialogsReducer.status,
        dialogs: state.DialogsReducer.data.dialogs,
        userId: state.AuthReducer.data.userId,
        currentDialogId: state.DialogsReducer.data.currentDialog.id,
      }
    },
  )

  console.log(status)
  console.log('DIALOGS_COMPONENT', dialogs)
  useEffect(() => {
    dispatch(dialogsActions.getAllDialogs({ userId: userId }))
  }, [dispatch, userId])

  useEffect(() => {
    if (dialogs?.length) {
      dispatch(dialogsActions.setCurrentDialog({ dialogId: dialogs[0].id }))
    } else {
      dispatch(dialogsActions.setCurrentDialog({ dialogId: null }))
    }
  }, [dialogs, currentDialogId, dispatch])

  const handleOpenDialog = useCallback(
    (id: number | null) => {
      dispatch(dialogsActions.setCurrentDialog({ dialogId: id }))
    },
    [dispatch],
  )

  if (status === 'loading') {
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
      {dialogs?.map((dialog: Dialog) => (
        <DialogRow
          key={dialog.id}
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
            handleOpenDialog(dialog.id)
          }}
          isCurrent={currentDialogId === dialog.id}
        />
      ))}
    </>
  )
}

export default Dialogs
