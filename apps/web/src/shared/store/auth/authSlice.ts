import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api'
import { ClientError } from 'shared/config'
import { BrowserStorageService } from 'shared/lib'
import { TokenService } from 'shared/lib'
import { GenericState } from '../genericSlice'
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
      console.log('LOGIN FULFILLED', action)
      const loggedData = action.payload
      const isRawLoggedData = RawLoggedDataSchema.guard(loggedData)
      if (isRawLoggedData) {
        const error: ClientError = {
          type: 'ERROR_BACKEND_REQUEST_VALIDATION',
          date: new Date(),
          message:
            '[Login fulfilled] Fetched logged data format is wrong' +
            JSON.stringify(loggedData),
          details: '',
        }
        console.error(error)
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
    console.log('login', loginData)
    const response = await APIInstance.post('/auth/login', loginData)
    console.log('Auth Login', response)
    return response.data
  },
)
