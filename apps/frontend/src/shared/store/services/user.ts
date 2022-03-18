import { Character } from './../../types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { MARVEL_API } from '../../environment-variables'

const defaultCharacters: Character[] = []

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: MARVEL_API }),
  endpoints: builder => ({
    getUsers: builder.query<Character[], string>({
      query: () => `characters`,
      transformResponse: (res, meta, arg) => {
        if (!isCharactersResponse(res)) return defaultCharacters
        console.log(isCharactersResponse(res))
        if (!isCharacters(res.data.results)) return defaultCharacters
        console.log('res.results', res.data.results)
        return res.data.results
      },
    }),
  }),
})

type RawCharactersResponse = {
  data: {
    count: number
    limit: number
    offset: number
    results: Array<unknown>
    total: number
  }
}

function isCharactersResponse(res: unknown): res is RawCharactersResponse {
  console.group('isCharactersResponse')
  console.log(res)
  console.groupEnd()
  if (typeof res !== 'object' || !res) return false

  if (!(res as RawCharactersResponse).data) return false
  return true
}

function isCharacter(item: unknown): item is Character {
  return (
    (item as Character).id !== undefined &&
    (item as Character).name !== undefined &&
    (item as Character).thumbnail !== undefined &&
    (item as Character).thumbnail.path !== undefined &&
    (item as Character).thumbnail.extension !== undefined
  )
}

function isCharacters(items: unknown): items is Character[] {
  console.log('isCharacters')
  if (!Array.isArray(items)) {
    return false
  }
  return items.reduce((isCharacters: boolean, item) => {
    return isCharacters && isCharacter(item)
  }, true)
}

export const { useGetUsersQuery } = userApi
