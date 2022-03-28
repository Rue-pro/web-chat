import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api/httpClient'
import { loadState, saveState } from 'shared/lib'
import { GenericState } from './genericSlice'

const KEY = 'auth'
interface AuthData {
  isAuth: boolean
}
interface AuthState extends GenericState<AuthData> {}

type LoginData = {
  email: string
  password: string
}

const defaultData: AuthData = {
  isAuth: false,
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
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state: AuthState) => {
      state.data.isAuth = true
      saveState<AuthData>(KEY, state.data)
      state.status = 'finished'
    })
    builder.addCase(login.rejected, (state: AuthState, action) => {
      state.error = action.error.message
      state.status = 'error'
    })
  },
})

export default authSlice.reducer
