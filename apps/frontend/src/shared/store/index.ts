import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

import { emptyApi as api } from 'shared/api/endpoints/emptyApi'
import AuthReducer from 'shared/store/authSlice'
import SocketReducer from 'shared/store/socketSlice'
import MessagesReducer from 'shared/store/messagesSlice'
import DialogsReducer from 'shared/store/dialogsSlice'
import { myLogger } from './middleware/log'
import socketMiddleware from './middleware/socketMiddleware'

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  AuthReducer,
  SocketReducer,
  MessagesReducer,
  DialogsReducer,
})

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
