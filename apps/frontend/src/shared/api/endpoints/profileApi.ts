import { Record, String, Static } from 'runtypes'

import { emptyApi } from './emptyApi'

const UserSchema = Record({
  id: String,
  name: String,
  email: String,
  createdAt: String,
  updatedAt: String,
  phone: String,
  password: String,
  avatar: String,
})

type User = Static<typeof UserSchema>

const defaultUser = {
  id: '',
  name: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  phone: '',
  password: '',
  avatar: '',
}

const extendedApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ['profile'] })
  .injectEndpoints({
    endpoints: build => ({
      getProfile: build.query<User, string>({
        query: id => ({
          url: `/users/${id}`,
          method: 'GET',
        }),
        transformResponse: (res): User => {
          console.log('PROFILE_DATA_TRANSFORM_RESPONSE', res)
          const isUserSchema = UserSchema.guard(res)
          if (isUserSchema) {
            return res
          }
          return defaultUser
        },
      }),
    }),
    overrideExisting: false,
  })

export const { useGetProfileQuery } = extendedApi
