import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, AxiosError } from 'axios'

import { API_URL } from 'shared/config/environment-variables'
import { APIInstance } from 'shared/api/httpClient'
import { PATHS } from 'shared/config/routes'

const CustomQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data }) => {
    try {
      const result = await APIInstance({ url: baseUrl + url, method, data })
      return { data: result.data }
    } catch (axiosError) {
      const error = axiosError as AxiosError
      if (!error.response) {
        document.location = document.location.origin + PATHS.BadGatewayPage
      }
      return {
        error: { status: error.response?.status, data: error.response?.data },
      }
    }
  }

export const emptyApi = createApi({
  reducerPath: 'api',
  baseQuery: CustomQuery({ baseUrl: API_URL }),
  endpoints: () => ({}),
})
