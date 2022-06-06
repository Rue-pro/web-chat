import { SerializedError } from '@reduxjs/toolkit'
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig } from 'axios'

import { APIInstance, API_URL } from 'shared/config'

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
