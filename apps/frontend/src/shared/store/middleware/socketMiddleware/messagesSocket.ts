import { Socket } from 'socket.io-client'

import { TStore } from 'shared/store'
import { chatActions, ChatEvent, Message } from 'shared/store/messagesSlice'

export function messagesSocketListeners(socket: Socket, store: TStore) {
  socket.on(ChatEvent.SendAllMessages, (messages: Message[]) => {
    console.log('CHAT_MIDDLEWARE_SEND_ALL_MESSAGES', messages)
    store.dispatch(chatActions.receiveAllMessages({ messages }))
  })

  socket.on(ChatEvent.ReceiveMessage, (message: Message) => {
    console.log('CHAT_MIDDLEWARE_RECEIVE_MESSAGE', message)
    store.dispatch(chatActions.receiveMessage({ message }))
  })
}

export function messagesSocketEmiters(
  socket: Socket,
  action: any,
  isConnectionEstablished: boolean,
) {
  if (chatActions.submitMessage.match(action) && isConnectionEstablished) {
    console.log('SOCKET_EMIT')
    socket.emit(ChatEvent.SendMessage, action.payload)
  }

  if (chatActions.getAllMessages.match(action) && isConnectionEstablished) {
    console.log('CHAT_MIDDLEWARE_GET_ALL_MESSAGES')
    socket.emit(ChatEvent.RequestAllMessages, action.payload.userId)
  }
}
