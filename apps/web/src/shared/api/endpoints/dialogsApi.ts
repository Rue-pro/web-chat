import { Record, Static, Number, Array, Optional } from 'runtypes'

import { generateWrongFetchedFormatError } from 'shared/lib'
import {
  RawDialogMessageSchema,
  RawDialogUserSchema,
} from 'shared/store/dialogs/types'

import { emptyApi } from './emptyApi'

export type Query = string

const SearchDialogResultSchema = Record({
  id: Optional(Number),
  user: RawDialogUserSchema,
  message: Optional(RawDialogMessageSchema),
})

const SearchDialogResultArrSchema = Array(SearchDialogResultSchema)

export type SearchDialogResult = Static<typeof SearchDialogResultSchema>

export const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['dialogs'] })
  .injectEndpoints({
    endpoints: build => ({
      findDialogs: build.query<SearchDialogResult[], Query>({
        query: query => ({
          url: `/conversations/search?query=${query}`,
          method: 'GET',
        }),
        transformResponse: (res): SearchDialogResult[] => {
          const isDialogArr = SearchDialogResultArrSchema.guard(res)
          if (!isDialogArr) {
            const error = generateWrongFetchedFormatError({
              query: 'Find dialogs query',
              entity: 'conversations',
              res,
              expectedType: SearchDialogResultArrSchema,
            })
            console.error(error)
            return []
          }
          return res
        },
      }),
    }),
  })

export const { useFindDialogsQuery } = extendedApi
