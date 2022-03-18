import { API } from '../environment-variables'
import { User } from '../types'

export type TGetUsers = {
  Users: User[]
  total: number
}

export function getUsers(): Promise<TGetUsers> {
  return fetch(`${API}/users`)
    .then(res => res.json())
    .then(json => json)
    .catch(error => {
      console.error('getUsers', error)
      return error
    })
}
