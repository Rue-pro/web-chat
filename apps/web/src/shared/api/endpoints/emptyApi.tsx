import { SerializedError } from '@reduxjs/toolkit'
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig } from 'axios'

import { APIInstance } from 'shared/config'

const CustomQuery =
  (): BaseQueryFn<
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
    } catch (axiosHandledError) {}
  }

export const emptyApi = createApi({
  reducerPath: 'api',
  baseQuery: CustomQuery(),
  endpoints: () => ({}),
})
