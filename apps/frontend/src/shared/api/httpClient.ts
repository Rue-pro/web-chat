import axios from 'axios'

import { API_URL } from 'shared/config/environment-variables'
import { sleep } from 'shared/lib'

export const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
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
