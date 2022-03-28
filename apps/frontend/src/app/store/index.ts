import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'

import { emptyApi as api } from 'shared/api/endpoints/emptyApi'
import AuthReducer from 'shared/store/authSlice'
import { myLogger } from './middleware/log'
import { myErrorCatcher } from './middleware/errorCatcher'

const store = configureStore({
  reducer: combineReducers({
    [api.reducerPath]: api.reducer,
    AuthReducer,
  }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      thunkMiddleware,
      myLogger,
      myErrorCatcher,
      api.middleware,
    ),
})

export default store
export type TStore = ReturnType<typeof store.getState>
