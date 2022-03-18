import { userApi } from './services/user'
import { combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import charactersReducer from './reducers/charactersSlice'
import { myLogger } from './middleware/log'
import { myErrorCatcher } from './middleware/errorCatcher'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: combineReducers({
    characters: charactersReducer,
    [userApi.reducerPath]: userApi.reducer,
  }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      thunkMiddleware,
      myLogger,
      myErrorCatcher,
      userApi.middleware,
    ),
})

export default store
export type TStore = ReturnType<typeof store.getState>
