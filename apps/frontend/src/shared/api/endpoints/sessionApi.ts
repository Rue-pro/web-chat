import { emptyApi } from './emptySplitApi'
import { Record, String, Static } from 'runtypes'

type LoginData = {
  email: string
  password: string
}

const JWTTokenScheme = Record({
  accessToken: String,
})

type JWTToken = Static<typeof JWTTokenScheme>

const DefaultJWTToken: JWTToken = {
  accessToken: '',
}

const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['session'] })
  .injectEndpoints({
    endpoints: build => ({
      getJWTToken: build.mutation<JWTToken, LoginData>({
        query: body => ({
          url: `/auth/login`,
          method: 'POST',
          body: body,
        }),
        transformResponse: (res, meta, arg): JWTToken => {
          const isJWTTokenScheme = JWTTokenScheme.guard(res)
          if (isJWTTokenScheme) {
            return res
          }
          return DefaultJWTToken
        },
      }),
      upateJWTToken: build.query<string, void>({
        query: () => `/auth/refresh`,
        transformResponse: (res, meta, arg) => {
          return ''
        },
      }),
    }),
    overrideExisting: false,
  })

export const { useGetJWTTokenMutation, useUpateJWTTokenQuery } = extendedApi
