export interface GenericState<T> {
  data: T
  error?: string
  status: 'loading' | 'idle' | 'error'
}
