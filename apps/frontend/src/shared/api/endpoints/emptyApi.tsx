import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig, AxiosError } from 'axios'
import { toast } from 'react-toastify'

import { API_URL } from 'shared/config/environment-variables'
import { APIInstance } from 'shared/api/httpClient'

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
      toast.error(
        `Error: ${err.response?.status} \n ${err.response?.data?.message}`,
      )
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
