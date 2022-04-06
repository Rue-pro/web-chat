import { Record, String, Static, Number, Union, Literal, Array } from 'runtypes'
import { io, Socket } from 'socket.io-client'

import { API_URL } from 'shared/config/environment-variables'
import { emptyApi } from './emptyApi'

enum ChatEvent {
  SendMessage = 'send_message',
  RequestAllMessages = 'request_all_messages',
  SendAllMessages = 'send_all_messages',
  ReceiveMessage = 'receive_message',
}

const OwnerSchema = Union(Literal('own'), Literal('theirs'))
const MessageSchema = Record({
  id: Number,
  createdAt: String,
  content: String,
  owner: OwnerSchema,
})
const MessagesArrSchema = Array(MessageSchema)

export type MessageOwner = Static<typeof OwnerSchema>
type Message = Static<typeof MessageSchema>
interface NewMessage {
  receiverId: string
  content: string
}

let socket: Socket
function getSocket() {
  if (!socket) {
    socket = io(`${API_URL}`, {
      withCredentials: true,
      path: '/messages',
    })
  }
  return socket
}

export const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['messages'] })
  .injectEndpoints({
    endpoints: build => ({
      sendMessage: build.mutation<Message, NewMessage>({
        queryFn: (message: NewMessage) => {
          const socket = getSocket()

          return new Promise(resolve => {
            socket.emit(ChatEvent.SendMessage, message, (message: Message) => {
              resolve({ data: message })
            })
          })
        },
      }),
      getMessages: build.query<Message[], string>({
        queryFn: () => ({ data: [] }),
        async onCacheEntryAdded(
          id,
          { cacheEntryRemoved, cacheDataLoaded, updateCachedData },
        ) {
          try {
            await cacheDataLoaded

            const socket = getSocket()

            socket.on('connect', () => {
              socket.emit(ChatEvent.RequestAllMessages)
            })

            socket.on(ChatEvent.SendAllMessages, (messages: Message[]) => {
              const isMessagesArr = MessagesArrSchema.guard(messages)
              if (!isMessagesArr) {
                console.error(
                  'Fetched through socket messages format is wrong!',
                )
                return
              }
              updateCachedData(draft => {
                draft.splice(0, draft.length, ...messages)
              })
            })

            socket.on(ChatEvent.ReceiveMessage, (message: Message) => {
              const isMessage = MessageSchema.guard(message)
              if (!isMessage) {
                console.error('Fetched through socket message format is wrong!')
                return
              }
              updateCachedData(draft => {
                draft.push(message)
              })
            })

            await cacheEntryRemoved

            socket.off('connect')
            socket.off(ChatEvent.SendAllMessages)
            socket.off(ChatEvent.ReceiveMessage)
          } catch {
            // if cacheEntryRemoved resolved before cacheDataLoaded,
            // cacheDataLoaded throws
          }
        },
      }),
    }),
    overrideExisting: false,
  })

export const { useSendMessageMutation, useGetMessagesQuery } = extendedApi
