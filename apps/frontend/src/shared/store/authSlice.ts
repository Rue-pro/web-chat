import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api/httpClient'
import { loadState, saveState } from 'shared/lib'
import { GenericState } from './genericSlice'

const KEY = 'auth'
interface AuthData {
  isAuth: boolean
  userId: string
  needRefresh: boolean
}
interface AuthState extends GenericState<AuthData> {}

type LoginData = {
  email: string
  password: string
}

const defaultData: AuthData = {
  isAuth: false,
  userId: '',
  needRefresh: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData) => {
    const response = await APIInstance.post('/auth/login', loginData)
    console.log('LOGIN_RESULT', response)
    return response.data
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await APIInstance.get('/auth/logout')
  console.log('LOGOUT_RESULT', response)
  return response.data
})

export const refreshToken = createAsyncThunk('auth/refresh', async () => {
  const response = await APIInstance.get('/auth/refresh')
  console.log('REFRESH_RESULT', response)
  return response.data
})

const initialState: AuthState = {
  data: loadState<AuthData>(KEY, defaultData),
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setNeedRefresh(state, action: PayloadAction<boolean>) {
      state.data.needRefresh = action.payload
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
      saveState<AuthData>(KEY, state.data)
    })
    builder.addCase(login.rejected, (state: AuthState, action) => {
      console.log('LOGIN_REJECTED', action)
      state.status = 'error'
      state.error = action.error.message
    })

    builder.addCase(logout.pending, (state: AuthState) => {
      state.status = 'loading'
    })
    builder.addCase(logout.fulfilled, (state: AuthState, action) => {
      console.log('LOGOUT_FULFILLED', action)
      state.status = 'idle'
      state.data.isAuth = false
      state.data.userId = ''
      state.data.needRefresh = false
      saveState<AuthData>(KEY, state.data)
    })
    builder.addCase(logout.rejected, (state: AuthState, action) => {
      console.log('LOGOUT_REJECTED', action)
      state.status = 'error'
      state.error = action.error.message
    })

    builder.addCase(refreshToken.pending, (state: AuthState) => {
      state.status = 'loading'
    })
    builder.addCase(refreshToken.fulfilled, (state: AuthState, action) => {
      console.log('REFRESH_TOKEN_FULFILLED', action)
      state.status = 'idle'
      state.data.isAuth = true
      state.data.userId = action.payload.id
      state.data.needRefresh = false
      saveState<AuthData>(KEY, state.data)
    })
    builder.addCase(refreshToken.rejected, (state: AuthState, action) => {
      console.log('REFRESH_TOKEN_REJECTED', action)
      state.status = 'error'
      state.error = action.error.message
    })
  },
})

export const authActions = authSlice.actions
export default authSlice.reducer
