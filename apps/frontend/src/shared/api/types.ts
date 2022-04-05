type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default'

export interface Toast {
  type: ToastType
  content: string
}

export type AvatarExtension = 'jpg' | 'png' | 'gif'

export interface Avatar {
  path: string
  extension: AvatarExtension
  alt: string
}
