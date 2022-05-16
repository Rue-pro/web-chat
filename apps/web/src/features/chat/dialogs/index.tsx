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
import { DialogId } from 'shared/config'

interface DialogsProps {}

const Dialogs: React.FC<DialogsProps> = () => {
  const dispatch = useDispatch<TDispatch>()
  const { status, dialogs, userId, currentDialogId, isConnected } = useSelector(
    (state: TStore) => {
      return {
        status: state.DialogsReducer.status,
        dialogs: state.DialogsReducer.data.dialogs,
        userId: state.AuthReducer.data.userId,
        currentDialogId: state.DialogsReducer.data.currentDialog.id,
        isConnected: state.SocketReducer.isConnectionEstablished,
      }
    },
  )

  useEffect(() => {
    if (isConnected) {
      dispatch(dialogsActions.getAllDialogs({ userId: userId }))
    }
  }, [dispatch, userId, isConnected])

  useEffect(() => {
    if (dialogs?.length && !currentDialogId) {
      dispatch(
        dialogsActions.setCurrentDialog({
          type: 'EXISTING_DIALOG',
          id: dialogs[0].id,
        }),
      )
    } else {
      dispatch(dialogsActions.setCurrentDialog({ type: 'NO_DIALOG', id: null }))
    }
  }, [dialogs, currentDialogId, dispatch])

  const handleOpenDialog = useCallback(
    (id: DialogId) => {
      dispatch(dialogsActions.setCurrentDialog({ type: 'EXISTING_DIALOG', id }))
    },
    [dispatch],
  )

  console.log('DIALOGS', dialogs)
  console.log('DIALOGS_LOADING_STATUS', status)
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
          avatar={{
            src: dialog.user.avatar ?? '',
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
