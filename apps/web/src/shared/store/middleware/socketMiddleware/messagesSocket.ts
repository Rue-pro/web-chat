import { Socket } from 'socket.io-client'
import { MiddlewareAPI, Dispatch, AnyAction } from 'redux'

import { TStore } from '../../index'
import { messagesActions } from '../../messages/messagesSlice'
import { ChatMessageEvent, RawMessage } from '../../messages/types'
import { DialogTypes } from '../../dialogs/types'

export function messagesSocketListeners(
  socket: Socket,
  store: MiddlewareAPI<Dispatch<AnyAction>, TStore>,
) {
  socket.on(ChatMessageEvent.SendAllMessages, (messages: RawMessage[]) => {
    store.dispatch(messagesActions.receiveAllMessages({ messages }))
  })

  socket.on(ChatMessageEvent.ReceiveMessage, (message: RawMessage) => {
    const currentDialog = store.getState().DialogsReducer.data.currentDialog
    if (
      (currentDialog.type === DialogTypes.NEW_DIALOG &&
        message.receiverId === currentDialog.id) ||
      (currentDialog.type === DialogTypes.EXISTING_DIALOG &&
        message.conversationId === currentDialog.id)
    )
      store.dispatch(messagesActions.receiveMessage({ message }))
  })
}

export function messagesSocketEmiters(
  socket: Socket,
  action: AnyAction,
  isConnectionEstablished: boolean,
) {
  if (messagesActions.submitMessage.match(action) && isConnectionEstablished) {
    socket.emit(ChatMessageEvent.SendMessage, action.payload)
  }

  if (messagesActions.getAllMessages.match(action) && isConnectionEstablished) {
    socket.emit(ChatMessageEvent.RequestAllMessages, action.payload.dialogId)
  }
}
