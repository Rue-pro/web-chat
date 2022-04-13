import { Socket } from 'socket.io-client'

import { TStore } from 'shared/store'
import { dialogsActions, Dialog } from 'shared/store/dialogsSlice'

export enum ChatDialogEvent {
  RequestAllDialogs = 'request_all_dialogs',
  SendAllDialogs = 'send_all_dialogs',
  ReceiveCreatedDialog = 'receive_created_dialog',
}

export function dialogsSocketListeners(socket: Socket, store: TStore) {
  socket.on(ChatDialogEvent.SendAllDialogs, (dialogs: Dialog[]) => {
    console.log('CHAT_DIALOGS_MIDDLEWARE_SEND_ALL_DIALOGS', dialogs)
    store.dispatch(dialogsActions.receiveAllDialogs({ dialogs }))
  })

  socket.on(ChatDialogEvent.ReceiveCreatedDialog, (conversaion: any) => {
    console.log('CHAT_DIALOGS_MIDDLEWARE_RECEIVE_CONVERSATION', conversaion)
    /**
     * TODO
     * проверка установлен ли текущий другой диалог и мы общаемся с пользователем
     * если нет
     * устанавливаем текущий диалог conversation.id
     *
     */
  })
}

export function dialogsSocketEmiters(
  socket: Socket,
  action: any,
  isConnectionEstablished: boolean,
) {
  if (dialogsActions.getAllDialogs.match(action) && isConnectionEstablished) {
    console.log('CHAT_DIALOGS_MIDDLEWARE_GET_ALL_DIALOGS')
    socket.emit(ChatDialogEvent.RequestAllDialogs)
  }
}
