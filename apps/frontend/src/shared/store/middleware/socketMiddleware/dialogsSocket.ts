import { Socket } from 'socket.io-client'

import { TStore } from 'shared/store'
import { chatActions, ChatEvent, Dialog } from 'shared/store/messagesSlice'

export function dialogsSocketListeners(socket: Socket, store: TStore) {
  socket.on(ChatEvent.SendAllDialogs, (dialogs: Dialog[]) => {
    console.log('CHAT_MIDDLEWARE_SEND_ALL_DIALOGS', dialogs)
    store.dispatch(chatActions.receiveAllDialogs({ dialogs }))
  })
}

export function dialogsSocketEmiters(
  socket: Socket,
  action: any,
  isConnectionEstablished: boolean,
) {
  if (chatActions.getAllDialogs.match(action) && isConnectionEstablished) {
    console.log('CHAT_MIDDLEWARE_GET_ALL_DIALOGS')
    socket.emit(ChatEvent.RequestAllDialogs, action.payload.userId)
  }
}
