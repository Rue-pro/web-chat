import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DialogRow } from 'entities/dialog'
import { dateToRuDate } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogs/dialogsSlice'
import { Dialog, DialogTypes } from 'shared/store/dialogs/types'
import { DialogId } from 'shared/config'
import useIsDevice from 'shared/lib/useDevice'

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

  const { isDesktop } = useIsDevice()

  useEffect(() => {
    if (isConnected) {
      dispatch(dialogsActions.getAllDialogs())
    }
  }, [dispatch, isConnected])

  useEffect(() => {
    if (!dialogs.length) {
      dispatch(
        dialogsActions.setCurrentDialog({
          type: DialogTypes.NO_DIALOG,
          id: null,
        }),
      )
      return
    }
    if (!currentDialogId && isDesktop) {
      dispatch(
        dialogsActions.setCurrentDialog({
          type: DialogTypes.EXISTING_DIALOG,
          id: dialogs[0].id,
          title: dialogs[0].user.name,
        }),
      )
    }
  }, [dispatch, dialogs, status, currentDialogId, isDesktop])

  const handleOpenDialog = useCallback(
    (id: DialogId, title: string) => {
      dispatch(
        dialogsActions.setCurrentDialog({
          type: DialogTypes.EXISTING_DIALOG,
          id,
          title,
        }),
      )
    },
    [dispatch],
  )

  return (
    <>
      {dialogs.map((dialog: Dialog) => (
        <DialogRow
          key={dialog.id}
          avatar={{
            src: dialog.user.avatar,
            alt: dialog.user.name,
          }}
          title={dialog.user.name}
          message={dialog.message.content}
          sentTime={dateToRuDate(new Date(dialog.message.createdAt))}
          onClick={() => {
            handleOpenDialog(dialog.id, dialog.user.name)
          }}
          isCurrent={currentDialogId === dialog.id}
        />
      ))}
    </>
  )
}

export default Dialogs
