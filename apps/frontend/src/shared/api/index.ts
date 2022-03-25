import { API_URL } from '../config/environment-variables'
import { Session } from '../types'
import { User } from './types'

export type TGetUsers = {
  Users: User[]
  total: number
}

export function getUsers(): Promise<TGetUsers> {
  return fetch(`${API_URL}/users`)
    .then(res => res.json())
    .then(json => json)
    .catch(error => {
      console.error('getUsers', error)
      return error
    })
}

type LoginData = {
  email: string
  password: string
}

export function login(data: LoginData): Promise<Session> {
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(json => {
      console.log('login', json)
      return json
    })
    .catch(error => {
      console.error('login', error)
      return error
    })
}
