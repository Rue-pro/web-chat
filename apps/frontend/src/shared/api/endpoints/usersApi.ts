import { emptyApi } from './emptyApi'
import { User } from 'shared/api/types'
import { io, Socket } from 'socket.io-client'
import { API_URL } from 'shared/config/environment-variables'

enum UserEvent {
  SendMessage = 'send_message',
  RequestAllMessages = 'request_all_messages',
  SendAllMessages = 'send_all_messages',
  ReceiveMessage = 'receive_message',
}

type Receiver = 'GROUP' | 'PERSON'

type Message = {
  id: string
  content: string
  authorId: string
  receiverId: string
  receiver_type: Receiver
  sentTime: string
}

type Dialog = {
  user: User
  message?: Message
}

let socket: Socket
function getSocket() {
  if (!socket) {
    socket = io(`${API_URL}`, {
      withCredentials: true,
      path: '/users',
    })
  }
  return socket
}

export const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['session'] })
  .injectEndpoints({
    endpoints: build => ({
      getUsers: build.query<Dialog[], void>({
        query: () => ({
          url: `/users/dialogs`,
          method: 'GET',
        }),
      }),
    }),
    overrideExisting: false,
  })

export const { useGetUsersQuery } = extendedApi
