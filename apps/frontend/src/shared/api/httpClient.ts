import axios from 'axios'

import { API_URL } from 'shared/config/environment-variables'
import { sleep } from 'shared/lib'

export const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

APIInstance.interceptors.request.use(({ ...config }) => {
  // X-Authorization
  const accessToken = '2131231' // getToken from the store
  if (!accessToken) return config

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
    },
  }
})

APIInstance.interceptors.response.use(async response => {
  await sleep()
  return response
})

APIInstance.interceptors.request.use(async request => {
  console.log('request')
  console.log(request)
  return request
})

APIInstance.interceptors.response.use(async response => {
  console.log('response')
  console.log(response)
  return response
})

/**
 * console.log('axiosError', axiosError)
      let err = axiosError as AxiosError
      console.log('ERROR', err.response)
      if(err.response === undefined) {
        
      }
      toast.error(
        `Error: ${err.response?.status} \n ${err.response?.data?.message}`,
      )
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
 */
