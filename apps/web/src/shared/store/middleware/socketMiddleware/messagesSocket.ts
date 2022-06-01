import { Socket } from 'socket.io-client'
import { MiddlewareAPI, Dispatch, AnyAction } from 'redux'

import { TStore } from 'shared/store'
import {
  messagesActions,
  ChatMessageEvent,
  Message,
} from 'shared/store/messagesSlice'

export function messagesSocketListeners(
  socket: Socket,
  store: MiddlewareAPI<Dispatch<AnyAction>, TStore>,
) {
  socket.on(ChatMessageEvent.SendAllMessages, (messages: Message[]) => {
    console.log('CHAT_MIDDLEWARE_SEND_ALL_MESSAGES', messages)
    store.dispatch(messagesActions.receiveAllMessages({ messages }))
  })

  socket.on(ChatMessageEvent.ReceiveMessage, (message: Message) => {
    console.log('CHAT_MIDDLEWARE_RECEIVE_MESSAGE', message)
    console.log(
      'WANT MESSAGES FOR CAT WITH dialogId',
      store.getState().DialogsReducer.data.currentDialog.id,
    )
    const currentDialog = store.getState().DialogsReducer.data.currentDialog
    if (
      (currentDialog.type === 'NEW_DIALOG' &&
        message.receiverId === currentDialog.id) ||
      (currentDialog.type === 'EXISTING_DIALOG' &&
        message.dialogId === currentDialog.id)
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
    console.log('CHAT_MIDDLEWARE_SUBMIT_MESSAGE')
    socket.emit(ChatMessageEvent.SendMessage, action.payload)
  }

  if (messagesActions.getAllMessages.match(action) && isConnectionEstablished) {
    console.log('CHAT_MIDDLEWARE_GET_ALL_MESSAGES')
    socket.emit(ChatMessageEvent.RequestAllMessages, action.payload.dialogId)
  }
}
