import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

import { emptyApi as api } from 'shared/api/endpoints/emptyApi'
import AuthReducer from 'shared/store/authSlice'
import SocketReducer from 'shared/store/socketSlice'
import MessagesReducer from 'shared/store/messagesSlice'
import { myLogger } from './middleware/log'
import chatMiddleware from './middleware/chatMiddleware'
import socketMiddleware from './middleware/socketMiddleware'

const store = configureStore({
  reducer: combineReducers({
    [api.reducerPath]: api.reducer,
    AuthReducer,
    SocketReducer,
    MessagesReducer,
  }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      thunkMiddleware,
      myLogger,
      socketMiddleware,
      chatMiddleware,
      api.middleware,
    ),
})

export default store
export type TStore = ReturnType<typeof store.getState>
