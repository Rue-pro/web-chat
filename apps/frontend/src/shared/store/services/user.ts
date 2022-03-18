import { User } from './../../types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { MARVEL_API } from '../../environment-variables'

const defaultUsers: User[] = []

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: MARVEL_API }),
  endpoints: builder => ({
    getUsers: builder.query<User[], string>({
      query: () => `users`,
      transformResponse: (res, meta, arg) => {
        if (!isUsersResponse(res)) return defaultUsers
        console.log(isUsersResponse(res))
        if (!isUsers(res.data.results)) return defaultUsers
        console.log('res.results', res.data.results)
        return res.data.results
      },
    }),
  }),
})

type RawUsersResponse = {
  data: {
    count: number
    limit: number
    offset: number
    results: Array<unknown>
    total: number
  }
}

function isUsersResponse(res: unknown): res is RawUsersResponse {
  console.group('isUsersResponse')
  console.log(res)
  console.groupEnd()
  if (typeof res !== 'object' || !res) return false

  if (!(res as RawUsersResponse).data) return false
  return true
}

function isUser(item: unknown): item is User {
  return (
    (item as User).id !== undefined &&
    (item as User).name !== undefined &&
    (item as User).avatar !== undefined
  )
}

function isUsers(items: unknown): items is User[] {
  console.log('isUsers')
  if (!Array.isArray(items)) {
    return false
  }
  return items.reduce((isUsers: boolean, item) => {
    return isUsers && isUser(item)
  }, true)
}

export const { useGetUsersQuery } = userApi
