export type Toast = {
  type: 'info' | 'success' | 'warning' | 'error' | 'default'
  content: string
}

export type Character = {
  id: number
  name: string
  thumbnail: {
    path: string
    extension: 'jpg'
  }
}
