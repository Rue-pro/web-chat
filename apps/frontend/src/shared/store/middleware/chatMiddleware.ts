import { Middleware } from 'redux'
import { API_URL } from 'shared/config/environment-variables'
import { io, Socket } from 'socket.io-client'
import { chatActions, ChatEvent, Message } from '../messagesSlice'

const chatMiddleware: Middleware = store => {
  let socket: Socket

  return next => action => {
    /*
    if (chatActions.submitMessage.match(action) && isConnectionEstablished) {
      socket.emit(ChatEvent.SendMessage, action.payload.content)
    }

    if (chatActions.getAllMessages.match(action) && isConnectionEstablished) {
      console.log('CHAT_MIDDLEWARE_GET_ALL_MESSAGES')
      socket.emit(ChatEvent.RequestAllMessages, action.payload.userId)
    }
*/
    return next(action)
  }
}

export default chatMiddleware
