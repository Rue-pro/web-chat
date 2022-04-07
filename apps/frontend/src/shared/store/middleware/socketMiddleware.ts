import { Middleware } from 'redux'
import { io, Socket } from 'socket.io-client'

import { API_URL } from 'shared/config/environment-variables'
import { socketActions } from '../socketSlice'
import { chatActions, ChatEvent, Message } from '../messagesSlice'

const socketMiddleware: Middleware = store => {
  let socket: Socket

  return next => action => {
    const isConnectionEstablished =
      socket && store.getState().SocketReducer.isConnected

    if (socketActions.startConnecting.match(action)) {
      console.log('SOCKET_MIDDLEWARE_START_CONNECTING')
      socket = io(`${API_URL}`, {
        withCredentials: true,
        path: '/messages',
        transports: ['websocket', 'polling', 'flashsocket'],
      })

      socket.on('connect', () => {
        store.dispatch(socketActions.connectionEstablished())
      })

      socket.on(ChatEvent.SendAllMessages, (messages: Message[]) => {
        console.log('CHAT_MIDDLEWARE_SEND_ALL_MESSAGES', messages)
        store.dispatch(chatActions.receiveAllMessages({ messages }))
      })

      console.log('Навешиваю события')
      socket.on(ChatEvent.ReceiveMessage, (message: Message) => {
        console.log('CHAT_MIDDLEWARE_RECEIVE_MESSAGE', message)
        store.dispatch(chatActions.receiveMessage({ message }))
      })
    }

    if (chatActions.submitMessage.match(action) && isConnectionEstablished) {
      console.log('SOCKET_EMIT')
      socket.emit(ChatEvent.SendMessage, action.payload)
    }

    if (chatActions.getAllMessages.match(action) && isConnectionEstablished) {
      console.log('CHAT_MIDDLEWARE_GET_ALL_MESSAGES')
      socket.emit(ChatEvent.RequestAllMessages, action.payload.userId)
    }

    return next(action)
  }
}

export default socketMiddleware
