import { Socket } from 'socket.io-client'
import { AnyAction, Dispatch, MiddlewareAPI } from 'redux'

import { TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogs/dialogsSlice'
import { RawDialog } from 'shared/store/dialogs/types'

export enum ChatDialogEvent {
  RequestAllDialogs = 'request_all_dialogs',
  SendAllDialogs = 'send_all_dialogs',
}

export function dialogsSocketListeners(
  socket: Socket,
  store: MiddlewareAPI<Dispatch<AnyAction>, TStore>,
) {
  socket.on(ChatDialogEvent.SendAllDialogs, (dialogs: RawDialog[]) => {
    store.dispatch(dialogsActions.receiveAllDialogs({ dialogs }))
  })
}

export function dialogsSocketEmiters(
  socket: Socket,
  action: AnyAction,
  isConnectionEstablished: boolean,
) {
  if (dialogsActions.getAllDialogs.match(action) && isConnectionEstablished) {
    socket.emit(ChatDialogEvent.RequestAllDialogs)
  }
}
