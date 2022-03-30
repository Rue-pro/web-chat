import { emptyApi } from './emptyApi'
import { ChatEvent, Message } from 'shared/api/types'
import { io, Socket } from 'socket.io-client'
import { API_URL } from 'shared/config/environment-variables'

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
  .enhanceEndpoints({ addTagTypes: ['session'] })
  .injectEndpoints({
    endpoints: build => ({
      sendMessage: build.mutation<Message, string>({
        queryFn: (chatMessageContent: string) => {
          const socket = getSocket()
          console.log('SEND MESSAGE')

          return new Promise(resolve => {
            console.log(socket)
            socket.emit(
              ChatEvent.SendMessage,
              chatMessageContent,
              (message: Message) => {
                resolve({ data: message })
              },
            )
          })
        },
      }),
      getMessages: build.query<Message[], void>({
        queryFn: () => ({ data: [] }),
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
            console.log('ON_CACHE_ENTRY_ADDED')
            await cacheDataLoaded

            const socket = getSocket()

            socket.on('connect', () => {
              console.log('REQUEST_ALL_MESSAGES')
              socket.emit(ChatEvent.RequestAllMessages)
            })

            socket.on(ChatEvent.SendAllMessages, (messages: Message[]) => {
              updateCachedData(draft => {
                draft.splice(0, draft.length, ...messages)
              })
            })

            socket.on(ChatEvent.ReceiveMessage, (message: Message) => {
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
