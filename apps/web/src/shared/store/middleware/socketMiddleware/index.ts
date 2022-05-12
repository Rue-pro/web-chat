import { Middleware } from 'redux'
import { io, Socket } from 'socket.io-client'

import { API_URL } from 'shared/config'
import { authActions } from 'shared/store/authSlice'
import { socketActions } from 'shared/store/socketSlice'
import {
  messagesSocketEmiters,
  messagesSocketListeners,
} from './messagesSocket'
import { dialogsSocketEmiters, dialogsSocketListeners } from './dialogsSocket'

export const socketMiddleware: Middleware = store => {
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
        console.log('SOCKET_MIDDLEWARE_CONNECTED')
        store.dispatch(socketActions.connectionEstablished())
      })

      socket.on('error', (error: any) => {
        console.log('SOCKET_MIDDLEWARE_ERROR_HAPPEND', error)
        if (
          error.code === 403 &&
          error.message.name === 'ERROR_ACCESS_TOKEN_EXPIRED'
        ) {
          store.dispatch(authActions.setNeedRefresh(true))
        }
      })

      messagesSocketListeners(socket, store)
      dialogsSocketListeners(socket, store)
    }

    messagesSocketEmiters(socket, action, isConnectionEstablished)
    dialogsSocketEmiters(socket, action, isConnectionEstablished)

    return next(action)
  }
}
