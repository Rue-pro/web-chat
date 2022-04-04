import { Record, String, Static, Number, Array } from 'runtypes'

import { io, Socket } from 'socket.io-client'
import { API_URL } from 'shared/config/environment-variables'
import { emptyApi } from './emptyApi'

const DialogSchema = Record({
  user: Record({
    id: String,
    name: String,
    avatar: String,
  }),
  message: Record({
    id: Number,
    content: String,
    createdAt: String,
  }),
})

const DialogArrSchema = Array(DialogSchema)

type Dialog = Static<typeof DialogSchema>

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
          url: `/dialogs`,
          method: 'GET',
        }),
        transformResponse: (res): Dialog[] => {
          const isDialogArr = DialogArrSchema.guard(res)
          if (isDialogArr) {
            return res
          }
          return []
        },
      }),
    }),
  })

export const { useGetUsersQuery } = extendedApi
