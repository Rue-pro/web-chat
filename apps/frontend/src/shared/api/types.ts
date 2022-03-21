import { Record, String, Static } from 'runtypes'

export type Toast = {
  type: 'info' | 'success' | 'warning' | 'error' | 'default'
  content: string
}

export type AvatarExtension = 'jpg' | 'png' | 'gif'

export type Avatar = {
  path: string
  extension: AvatarExtension
}

export type Character = {
  id: number
  name: string
  thumbnail: {
    path: string
    extension: 'jpg'
  }
}

export const UserType = Record({
  id: String,
  name: String,
  /**
   * TODO
   * Make avatar type looks like
   * {
   *  path: string
   *  extension: 'jpg' | 'png' | 'gif'
   * }
   */
  avatar: String,
})

export type User = Static<typeof UserType>

// type guard
