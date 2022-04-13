import axios from 'axios'

import { API_URL } from 'shared/config/environment-variables'
import { PATHS } from 'shared/config/routes'
import { sleep } from 'shared/lib'
import store from 'shared/store'
import { authActions } from 'shared/store/authSlice'
import { HTTPError } from './types'

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

APIInstance.interceptors.request.use(
  async request => {
    return request
  },
  function (error) {
    console.log('resuqest error', error.payload)
    // Do something with request error
    return Promise.reject(error)
  },
)

APIInstance.interceptors.response.use(
  async response => {
    return response
  },
  function (error) {
    console.log('RESPOSE INTERCEPTOR', error.response)
    if (!error.response) {
      document.location = document.location.origin + PATHS.BadGatewayPage
    }
    if (
      error.response.data.message ===
      'Refreshing token is required, then retry the query'
    ) {
      store.dispatch(authActions.setNeedRefresh(true))
    }
    return Promise.reject<HTTPError>({
      message: error.response.data.message,
      name: `Error: ${error.response.status} ${error.response.statusText}`,
    })
  },
)
