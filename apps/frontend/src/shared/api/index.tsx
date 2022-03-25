import { APIInstance } from './httpClient'

type LoginData = {
  email: string
  password: string
}

export const login = (loginData: LoginData) => {
  return APIInstance.post('/auth/login', loginData)
}
