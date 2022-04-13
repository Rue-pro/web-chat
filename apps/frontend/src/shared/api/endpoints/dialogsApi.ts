import { Record, Static, Number, Array, Optional } from 'runtypes'
import {
  DialogUserSchema,
  DialogMessageSchema,
} from 'shared/store/dialogsSlice'

import { emptyApi } from './emptyApi'

const SearchDialogResultSchema = Record({
  id: Number,
  user: DialogUserSchema,
  message: Optional(DialogMessageSchema),
})
const SearchDialogResultArrSchema = Array(SearchDialogResultSchema)
export type SearchDialogResult = Static<typeof SearchDialogResultSchema>

export const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['dialogs'] })
  .injectEndpoints({
    endpoints: build => ({
      findDialogs: build.query<SearchDialogResult[], string>({
        query: query => ({
          url: `/dialogs/search?query=${query}`,
          method: 'GET',
        }),
        transformResponse: (res): SearchDialogResult[] => {
          const isDialogArr = SearchDialogResultArrSchema.guard(res)
          if (isDialogArr) {
            return res
          }
          return []
        },
      }),
    }),
  })

export const { useFindDialogsQuery } = extendedApi
