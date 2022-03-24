import { combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { myLogger } from './middleware/log'
import { myErrorCatcher } from './middleware/errorCatcher'
import { configureStore } from '@reduxjs/toolkit'
import { emptyApi as api } from '../../shared/api/endpoints/emptyApi'

const store = configureStore({
  reducer: combineReducers({
    [api.reducerPath]: api.reducer,
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
