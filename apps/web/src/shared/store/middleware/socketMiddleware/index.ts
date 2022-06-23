import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { io, Socket } from 'socket.io-client'

import { SOCKET_URL } from 'shared/config'
import { RefreshTokensResultError, TokenService } from 'shared/lib'
import { authActions } from '../../auth/authSlice'
import { socketActions } from '../../socket/socketSlice'
import {
  messagesSocketEmiters,
  messagesSocketListeners,
} from './messagesSocket'
import { dialogsSocketEmiters, dialogsSocketListeners } from './dialogsSocket'

export const socketMiddleware: Middleware = store => {
  let socket: Socket

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

      socket.on('error', async (error: any) => {
        socketErrorHandler(socket, error, store)
      })

      messagesSocketListeners(socket, store)
      dialogsSocketListeners(socket, store)
    }

    messagesSocketEmiters(socket, action, isConnectionEstablished)
    dialogsSocketEmiters(socket, action, isConnectionEstablished)

    return next(action)
  }
}

const socketErrorHandler = async (
  socket: Socket,
  error: any,
  store: MiddlewareAPI<Dispatch<AnyAction>, any>,
) => {
  if (error.message.name === 'ERROR_FOUND_NO_COOKIE') {
    store.dispatch(authActions.logout())
    return
  }
  if (error.name === 'TokenExpiredError') {
    const data = await TokenService.refreshTokens()
    if (typeof data === 'object') {
      if (socket.io.engine) socket.io.engine.close()
      socket.emit(error.query.event, error.query.payload)
    }
    if (data === RefreshTokensResultError.REFRESH_TOKEN_EXPIRED) {
      store.dispatch(authActions.logout())
    }
  }
}
