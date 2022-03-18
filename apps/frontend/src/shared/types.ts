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

export type User = {
  id: string
  name: string
  /**
   * TODO
   * Make avatar type looks like
   * {
   *  path: string
   *  extension: 'jpg' | 'png' | 'gif'
   * }
   */
  avatar: string
}
