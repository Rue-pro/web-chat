import { Middleware } from 'redux'
import { io, Socket } from 'socket.io-client'

import { SOCKET_URL } from 'shared/config'
import { authActions } from 'shared/store/authSlice'
import { socketActions } from 'shared/store/socketSlice'
import {
  messagesSocketEmiters,
  messagesSocketListeners,
} from './messagesSocket'
import { dialogsSocketEmiters, dialogsSocketListeners } from './dialogsSocket'
import { TokenService } from 'shared/services'

export const socketMiddleware: Middleware = store => {
  let socket: Socket
  let refetch = 0

  return next => action => {
    const isConnectionEstablished =
      socket && store.getState().SocketReducer.isConnectionEstablished
    if (socketActions.startConnecting.match(action)) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
        path: '/socket',
        transports: ['websocket', 'polling', 'flashsocket'],
      })

      socket.on('connect', () => {
        store.dispatch(socketActions.connectionEstablished())
      })

      socket.on('connect_error', err => {
        /*console.log(`connect_error due to ${err.message}`)
        console.log(err)*/
      })

      socket.on('error', async (error: any) => {
        if (error.message.name === 'ERROR_FOUND_NO_COOKIE') {
          store.dispatch(authActions.logout())
        }
        if (
          (error.code === 403 &&
            error.message.name === 'ERROR_ACCESS_TOKEN_EXPIRED') ||
          (error.code === 400 &&
            error.message.name === 'ERROR_FOUND_NO_ACCESS_TOKEN_COOKIE') ||
          error.name === 'TokenExpiredError'
        ) {
          const result = await TokenService.refreshTokens()
          if (socket.io.engine) socket.io.engine.close()
          if (result?.user) {
            socket.emit(error.query.event, error.query.payload)
          }
          if (result === 'ERROR_REFRESH_TOKEN_EXPIRED') {
            store.dispatch(authActions.logout())
          }
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
