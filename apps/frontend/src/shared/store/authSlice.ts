import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api/httpClient'
import { loadState, saveState } from 'shared/lib'
import { GenericState } from './genericSlice'

const KEY = 'auth'
interface AuthData {
  isAuth: boolean
  userId: string
}
interface AuthState extends GenericState<AuthData> {}

type LoginData = {
  email: string
  password: string
}

const defaultData: AuthData = {
  isAuth: false,
  userId: '',
}

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData) => {
    const response = await APIInstance.post('/auth/login', loginData)
    return response.data
  },
)

const initialState: AuthState = {
  data: loadState<AuthData>(KEY, defaultData),
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout(state) {
      state.status = 'loading'
      state.data.isAuth = false
      state.data.userId = ''
      saveState<AuthData>(KEY, state.data)
    },
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state: AuthState, action) => {
      state.status = 'finished'
      state.data.isAuth = true
      state.data.userId = action.payload.userId
      saveState<AuthData>(KEY, state.data)
    })
    builder.addCase(login.rejected, (state: AuthState, action) => {
      state.status = 'error'
      state.error = action.error.message
    })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
