import { Middleware } from 'redux'

export const myLogger: Middleware = store => next => action => {
  /*=console.group(`Request ${action?.type}`)
  console.log('store', store)
  console.log(' [f(action)]', next)
  console.log('action', action)
  console.groupEnd()*/
  return next(action)
}
