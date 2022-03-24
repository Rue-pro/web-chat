import axios from 'axios'
import { API_URL } from '../config/environment-variables'

export const APIInstance = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
})

APIInstance.interceptors.request.use(({ ...config }) => {
  console.log('axios.interceptors')
  console.log(config)
  // X-Authorization
  const accessToken = 'Bearer: 2131231' // getToken from the store
  if (!accessToken) return config

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      authorization: `${accessToken}`,
    },
  }
})
