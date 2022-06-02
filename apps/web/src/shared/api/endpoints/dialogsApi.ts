import { Record, Static, Number, Array, Optional } from 'runtypes'

import { DialogMessageSchema, DialogUserSchema } from 'shared/config'
import { emptyApi } from './emptyApi'

export type Query = string
const SearchDialogResultSchema = Record({
  id: Optional(Number),
  user: DialogUserSchema,
  message: Optional(DialogMessageSchema),
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
            console.error('Fetched dialogs format is wrong!', res)
            return []
          }
          return res
        },
      }),
    }),
  })

export const { useFindDialogsQuery } = extendedApi
