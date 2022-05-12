import { AnyAction, combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

import { api } from 'shared/api'
import AuthReducer from 'shared/store/authSlice'
import SocketReducer from 'shared/store/socketSlice'
import MessagesReducer from 'shared/store/messagesSlice'
import DialogsReducer from 'shared/store/dialogsSlice'
import { myLogger, socketMiddleware } from './middleware'

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  AuthReducer,
  SocketReducer,
  MessagesReducer,
  DialogsReducer,
})

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === 'auth/logout/fulfilled') {
    return appReducer(undefined, { type: undefined })
  }

  return appReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      thunkMiddleware,
      myLogger,
      socketMiddleware,
      api.middleware,
    ),
})

export default store
export type TStore = ReturnType<typeof store.getState>
export type TDispatch = typeof store.dispatch
