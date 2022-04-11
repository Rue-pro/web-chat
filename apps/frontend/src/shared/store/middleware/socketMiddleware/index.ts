import { Middleware } from 'redux'
import { io, Socket } from 'socket.io-client'

import { API_URL } from 'shared/config/environment-variables'
import { socketActions } from 'shared/store/socketSlice'
import {
  messagesSocketEmiters,
  messagesSocketListeners,
} from './messagesSocket'
import { dialogsSocketEmiters, dialogsSocketListeners } from './dialogsSocket'

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
      messagesSocketListeners(socket, store)
      dialogsSocketListeners(socket, store)
    }

    messagesSocketEmiters(socket, action, isConnectionEstablished)
    dialogsSocketEmiters(socket, action, isConnectionEstablished)

    return next(action)
  }
}

export default socketMiddleware
