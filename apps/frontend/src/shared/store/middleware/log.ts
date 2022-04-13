type Props = any
// [req, res, next]

export const myLogger = (store: Props) => (next: Props) => (action: Props) => {
  console.groupCollapsed(`Request ${action?.type}`)
  console.log('store', store)
  console.log(' [f(action)]', next)
  console.log('action', action)
  console.groupEnd()
  return next(action)
}
