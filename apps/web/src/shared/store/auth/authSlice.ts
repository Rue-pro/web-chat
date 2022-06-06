import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/config'
import {
  BrowserStorageService,
  generateWrongFetchedFormatError,
  TokenService,
} from 'shared/lib'
import { GenericState } from '../types'
import { User, LoginData, RawLoggedDataSchema } from './types'

const KEY = 'user'

const defaultUser: User = {
  userId: '',
}

interface AuthData {
  isAuth: boolean
  user: User
}

interface AuthState extends GenericState<AuthData> {}

const defaultData: AuthData = {
  isAuth: TokenService.isTokensValid(),
  user: defaultUser,
}

const initialState: AuthState = {
  data: {
    ...defaultData,
    user: BrowserStorageService.loadState<User>(KEY, defaultUser),
  },
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout(state) {
      BrowserStorageService.removeState(KEY)
      TokenService.removeTokensExpirationTime()

      state.data.isAuth = false
    },
    setAuth(state, action: PayloadAction<User>) {
      state.data.isAuth = true
      state.data.user.userId = action.payload.userId
      BrowserStorageService.saveState<User>(KEY, state.data.user)
    },
  },
  extraReducers: builder => {
    builder.addCase(login.pending, (state: AuthState) => {
      state.status = 'loading'
    })
    builder.addCase(login.fulfilled, (state: AuthState, action) => {
      const loggedData = action.payload
      const isRawLoggedData = RawLoggedDataSchema.guard(loggedData)
      if (isRawLoggedData) {
        const error = generateWrongFetchedFormatError({
          query: 'Login',
          entity: 'logged',
          res: loggedData,
          expectedType: RawLoggedDataSchema,
        })
        console.error(error)
        state.status = 'error'
        state.error = 'Something went wrong, try again later.'
        return
      }

      state.status = 'idle'
      state.data.isAuth = true
      state.data.user.userId = action.payload.user.id

      BrowserStorageService.saveState<User>(KEY, state.data.user)
      TokenService.setTokensExpirationTime(
        action.payload.accessToken.expiresIn,
        action.payload.refreshToken.expiresIn,
      )
    })
    builder.addCase(login.rejected, (state: AuthState, action) => {
      const error = action.error.message ? JSON.parse(action.error.message) : {}
      if (error?.isHandled) {
        state.status = 'idle'
        return
      }
      state.status = 'error'
      state.error = action.error.message
    })
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData) => {
    const response = await APIInstance.post('/auth/login', loginData)
    return response.data
  },
)
