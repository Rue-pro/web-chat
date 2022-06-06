import { generateWrongFetchedFormatError } from 'shared/lib'

import { emptyApi } from '../emptyApi'
import { rawDialogToDialog } from './model'
import { Query, RawSearchDialogArrSchema, SearchDialog } from './types'

export const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['dialogs'] })
  .injectEndpoints({
    endpoints: build => ({
      findDialogs: build.query<SearchDialog[], Query>({
        query: query => ({
          url: `/conversations/search?query=${query}`,
          method: 'GET',
        }),
        transformResponse: (res): SearchDialog[] => {
          const isDialogArr = RawSearchDialogArrSchema.guard(res)
          if (!isDialogArr) {
            const error = generateWrongFetchedFormatError({
              query: 'Find dialogs query',
              entity: 'conversations',
              res,
              expectedType: RawSearchDialogArrSchema,
            })
            console.error(error)
            return []
          }
          return res.map(rawDialogToDialog)
        },
      }),
    }),
  })

export const { useFindDialogsQuery } = extendedApi
