import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { dateToRuDate } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogs/dialogsSlice'
import { Dialog } from 'shared/store/dialogs/types'
import { DialogId } from 'shared/config'

interface DialogsProps {}

const Dialogs: React.FC<DialogsProps> = () => {
  const dispatch = useDispatch<TDispatch>()
  const { status, dialogs, currentDialogId, isConnected } = useSelector(
    (state: TStore) => {
      return {
        status: state.DialogsReducer.status,
        dialogs: state.DialogsReducer.data.dialogs,
        currentDialogId: state.DialogsReducer.data.currentDialog.id,
        isConnected: state.SocketReducer.isConnectionEstablished,
      }
    },
  )

  useEffect(() => {
    if (isConnected) {
      dispatch(dialogsActions.getAllDialogs())
    }
  }, [dispatch, isConnected])

  useEffect(() => {
    if (!dialogs.length) {
      dispatch(dialogsActions.setCurrentDialog({ type: 'NO_DIALOG', id: null }))
      return
    }
    if (!currentDialogId) {
      dispatch(
        dialogsActions.setCurrentDialog({
          type: 'EXISTING_DIALOG',
          id: dialogs[0].id,
        }),
      )
    }
  }, [dispatch, dialogs, status, currentDialogId])

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
      {dialogs?.map((dialog: Dialog) => (
        <DialogRow
          key={dialog.id}
          avatar={{
            src: dialog.user.avatar,
            alt: dialog.user.name,
          }}
          title={dialog.user.name}
          message={dialog.message.content}
          sentTime={dateToRuDate(dialog.message.createdAt)}
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
