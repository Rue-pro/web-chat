import { Record, String, Static, Number, Array, Optional } from 'runtypes'

import { emptyApi } from './emptyApi'

const DialogUserSchema = Record({
  id: String,
  name: String,
  avatar: String,
})

const DialogMessageSchema = Record({
  id: Number,
  content: String,
  createdAt: String,
})

const DialogSchema = Record({
  user: DialogUserSchema,
  message: DialogMessageSchema,
})

const SearchDialogResultSchema = Record({
  user: DialogUserSchema,
  message: Optional(DialogMessageSchema),
})

const DialogArrSchema = Array(DialogSchema)
const SearchDialogResultArrSchema = Array(SearchDialogResultSchema)

type Dialog = Static<typeof DialogSchema>
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
      getDialogs: build.query<Dialog[], void>({
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

export const { useGetDialogsQuery, useFindDialogsQuery } = extendedApi
