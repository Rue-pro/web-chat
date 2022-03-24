import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API } from '../../config/environment-variables'

export const emptyApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API }),
  endpoints: () => ({}),
})
