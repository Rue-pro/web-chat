import { Record, String, Static, Null } from 'runtypes'

import { UserId } from 'shared/config'
import { generateWrongFetchedFormatError } from 'shared/lib'
import { emptyApi } from './emptyApi'

const UserSchema = Record({
  id: String,
  name: String,
  email: String,
  createdAt: String,
  updatedAt: String,
  phone: String,
  password: String,
  avatar: String.Or(Null),
  currentHashedRefreshToken: String,
})

type User = Static<typeof UserSchema>

const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  phone: '',
  password: '',
  avatar: null,
  currentHashedRefreshToken: '',
}

const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['profile'] })
  .injectEndpoints({
    endpoints: build => ({
      getProfile: build.query<User, UserId>({
        query: id => ({
          url: `/users/${id}`,
          method: 'GET',
        }),
        transformResponse: (res): User => {
          const isUserSchema = UserSchema.guard(res)
          if (!isUserSchema) {
            const error = generateWrongFetchedFormatError({
              query: 'Get profile query',
              entity: 'profile',
              res,
              expectedType: UserSchema,
            })
            console.error(error)
            return defaultUser
          }
          return res
        },
      }),
    }),
    overrideExisting: false,
  })

export const { useGetProfileQuery } = extendedApi
