import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'

import { API_URL } from 'shared/config'
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
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
    },
  }
})

APIInstance.interceptors.request.use(
  async request => {
    return request
  },
  function (error) {
    return Promise.reject(error)
  },
)

export interface AxiosHandledError {
  isHandled: boolean
  status: number
  message: string
}

APIInstance.interceptors.response.use(
  async response => {
    return response
  },
  function (error: AxiosError) {
    const message: AxiosHandledError = {
      isHandled: false,
      status: error.response?.status ?? 500,
      message: error.response?.data.message ?? 'Something went wrong',
    }

    const toastText = getErrorText(error)
    if (toastText) {
      toast.error(toastText)
      message.isHandled = true
    }

    throw new Error(JSON.stringify(message))
  },
)

function getErrorText(error: AxiosError): string {
  if (!error.response) {
    return "Server sent no response. Seems like it's off."
  }
  if (error.response.status >= 500) {
    return 'Something went wrong.'
  }
  return ''
}
