import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, AxiosError } from 'axios'
import { API_URL } from '../../config/environment-variables'
import { APIInstance } from '../httpClient'
// API_URL

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
      let err = axiosError as AxiosError
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
    }
  }

export const emptyApi = createApi({
  reducerPath: 'api',
  baseQuery: CustomQuery({ baseUrl: API_URL }),
  endpoints: () => ({}),
})
