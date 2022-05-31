import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api'
import { UserId } from 'shared/config'
import { TokenService } from 'shared/services'
import { GenericState } from './genericSlice'

interface AuthData {
  isAuth: boolean
  userId: UserId
}

interface AuthState extends GenericState<AuthData> {}

type LoginData = {
  email: string
  password: string
}

const defaultData: AuthData = {
  isAuth: TokenService.isTokensValid(),
  userId: '',
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
  data: defaultData,
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout(state) {
      state.data.isAuth = false
      state.data.userId = ''
      TokenService.removeTokensExpirationTime()
    },
    setAuth(state) {
      state.data.isAuth = true
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
      state.data.userId = action.payload.id

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
