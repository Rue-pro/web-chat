import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api'
import { UserId } from 'shared/config'
import { loadState, saveState, removeState } from 'shared/lib'
import { TokenService } from 'shared/services'
import { GenericState } from './genericSlice'

const KEY = 'user'

interface User {
  userId: UserId
}

const defaultUser = {
  userId: '',
}

interface AuthData {
  isAuth: boolean
  user: User
}

interface AuthState extends GenericState<AuthData> {}

type LoginData = {
  email: string
  password: string
}

const defaultData: AuthData = {
  isAuth: TokenService.isTokensValid(),
  user: defaultUser,
}

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData) => {
    console.groupCollapsed('[AUTH_SLICE] login')
    const response = await APIInstance.post('/auth/login', loginData)
    console.log(response)
    console.groupEnd()
    return response.data
  },
)

const initialState: AuthState = {
  data: { ...defaultData, user: loadState<User>(KEY, defaultUser) },
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout(state) {
      console.log('LOGOUT')
      state.data.isAuth = false
      removeState(KEY)
      TokenService.removeTokensExpirationTime()
    },
    setAuth(state, action: PayloadAction<{ userId: UserId }>) {
      state.data.isAuth = true
      state.data.user.userId = action.payload.userId
      saveState<User>(KEY, state.data.user)
    },
  },
  extraReducers: builder => {
    builder.addCase(login.pending, (state: AuthState) => {
      state.status = 'loading'
    })
    builder.addCase(login.fulfilled, (state: AuthState, action) => {
      console.log('LOGIN_FULFILLED', action)
      state.status = 'idle'
      state.data.isAuth = true
      state.data.user.userId = action.payload.user.id

      saveState<User>(KEY, state.data.user)
      TokenService.setTokensExpirationTime(
        action.payload.accessToken.expiresIn,
        action.payload.refreshToken.expiresIn,
      )
    })
    builder.addCase(login.rejected, (state: AuthState, action) => {
      console.log('LOGIN_REJECTED', action)
      state.status = 'error'
      state.error = action.error.message
    })
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
