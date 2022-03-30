import { Record, String, Static, Number } from 'runtypes'

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default'

export type Toast = {
  type: ToastType
  content: string
}

export type AvatarExtension = 'jpg' | 'png' | 'gif'

export type Avatar = {
  path: string
  extension: AvatarExtension
  alt: string
}

export const UserScheme = Record({
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

export type User = Static<typeof UserScheme>
