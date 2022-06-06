import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, AxiosError } from 'axios'

import { APIInstance, API_URL, ServerError } from 'shared/config'

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
      const error = axiosError as AxiosError<ServerError>
      if (!error.response) {
        //document.location = document.location.origin + PAGES.BadGatewayPage
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
