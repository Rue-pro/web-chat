import { SerializedError } from '@reduxjs/toolkit'
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import axios, { AxiosRequestConfig, AxiosError } from 'axios'

import { APIInstance, API_URL, ServerError } from 'shared/config'
import { AxiosHandledError } from 'shared/config/httpClient'

const CustomQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    SerializedError
  > =>
  async ({
    url,
    method,
    data,
  }): Promise<AxiosRequestConfig['data'] | SerializedError> => {
    try {
      const result = await APIInstance.request({ url, method, data })
      return { data: result.data }
    } catch (axiosHandledError) {
      throw axiosHandledError
    }
  }

export const emptyApi = createApi({
  reducerPath: 'api',
  baseQuery: CustomQuery({ baseUrl: API_URL }),
  endpoints: () => ({}),
})
