import { Socket } from 'socket.io-client'
import { AnyAction, Dispatch, MiddlewareAPI } from 'redux'

import { TStore } from 'shared/store'
import { dialogsActions, Dialog } from 'shared/store/dialogsSlice'

export enum ChatDialogEvent {
  RequestAllDialogs = 'request_all_dialogs',
  SendAllDialogs = 'send_all_dialogs',
}

export function dialogsSocketListeners(
  socket: Socket,
  store: MiddlewareAPI<Dispatch<AnyAction>, TStore>,
) {
  socket.on(ChatDialogEvent.SendAllDialogs, (dialogs: Dialog[]) => {
    console.log('CHAT_DIALOGS_MIDDLEWARE_SEND_ALL_DIALOGS', dialogs)
    store.dispatch(dialogsActions.receiveAllDialogs({ dialogs }))
  })
}

export function dialogsSocketEmiters(
  socket: Socket,
  action: AnyAction,
  isConnectionEstablished: boolean,
) {
  if (dialogsActions.getAllDialogs.match(action) && isConnectionEstablished) {
    console.log('CHAT_DIALOGS_MIDDLEWARE_GET_ALL_DIALOGS')
    socket.emit(ChatDialogEvent.RequestAllDialogs)
  }
}
