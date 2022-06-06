import axios from 'axios'

import { API_URL, ServerError } from 'shared/config'
import { sleep } from 'shared/lib'
import { TokenService } from 'shared/lib'

export const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
})

APIInstance.interceptors.request.use(async ({ ...config }) => {
  if (config.url !== '/auth/login/' && config.url !== '/auth/logout/') {
    await TokenService.refreshTokens()
  }
  console.log('DO_REQUEST', config)
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

APIInstance.interceptors.request.use(
  async request => {
    return request
  },
  function (error) {
    return Promise.reject(error)
  },
)

APIInstance.interceptors.response.use(
  async response => {
    return response
  },
  function (error) {
    console.log('AXIOS LOGIN RESPONSE', error)
    if (!error.response) {
      //document.location = document.location.origin + PAGES.BadGatewayPage
    }
  },
)
