import { Record, String, Static, Number, Union, Literal, Array } from 'runtypes'
import { io, Socket } from 'socket.io-client'

import { API_URL } from 'shared/config/environment-variables'
import { emptyApi } from './emptyApi'

enum ChatMessageEvent {
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
      transports: ['websocket', 'polling', 'flashsocket'],
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
            socket.emit(
              ChatMessageEvent.SendMessage,
              message,
              (message: Message) => {
                resolve({ data: message })
              },
            )
          })
        },
      }),
      getMessages: build.query<Message[], string>({
        queryFn: (id: string) => {
          return new Promise(resolve => {
            console.log('queryFN')
            const socket = getSocket()

            socket.on('connect', () => {
              console.log('ALL_MESSAGES')
              socket.emit(
                ChatMessageEvent.RequestAllMessages,
                id,
                (messages: Message[]) => {
                  console.log('FULFILLED', messages)
                  resolve({ data: messages })
                },
              )
            })
          })

          if (socket.connected) {
            console.log('socket connected')
            return new Promise(resolve => {
              console.log('get messages')
              socket.emit(
                ChatMessageEvent.RequestAllMessages,
                id,
                (messages: Message[]) => {
                  console.log('FILFILLED', messages)
                  resolve({ data: messages })
                },
              )
            })
          } else {
            console.log('socket not connected')
            return { data: [] }
          }
        },
        async onCacheEntryAdded(
          id,
          {
            dispatch,
            getState,
            extra,
            requestId,
            cacheEntryRemoved,
            cacheDataLoaded,
            getCacheEntry,
            updateCachedData,
          },
        ) {
          try {
            console.log('onCacheEntryAdded')
            await cacheDataLoaded

            const socket = getSocket()

            /* socket.on('connect', () => {
              console.log('ALL_MESSAGES')
              return new Promise(resolve => {
                socket.emit(
                  ChatMessageEvent.RequestAllMessages,
                  id,
                  (messages: Message[]) => {
                    resolve({ data: messages })
                  },
                )
              })
            })

            socket.on(ChatMessageEvent.SendAllMessages, (messages: Message[]) => {
              console.log('SEND ALL MESSAGES')
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
            })*/

            socket.on(ChatMessageEvent.ReceiveMessage, (message: Message) => {
              console.log('RECEIVE MESSAFE')
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
            socket.off(ChatMessageEvent.SendAllMessages)
            socket.off(ChatMessageEvent.ReceiveMessage)
          } catch {
            // if cacheEntryRemoved resolved before cacheDataLoaded,
            // cacheDataLoaded throws
          }
        },
        /*async onQueryStarted(
          arg,
          {
            dispatch,
            getState,
            queryFulfilled,
            requestId,
            extra,
            getCacheEntry,
          },
        ) {
          console.log('query started')
          console.log(arg)
        },*/
      }),
    }),
    overrideExisting: false,
  })

export const { useSendMessageMutation, useGetMessagesQuery } = extendedApi
