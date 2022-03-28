import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { APIInstance } from 'shared/api/httpClient'
import { GenericState } from './genericSlice'

interface AuthState
  extends GenericState<{
    isAuth: boolean
  }> {}

type LoginData = {
  email: string
  password: string
}

export const login = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData) => {
    const response = await APIInstance.post('/auth/login', loginData)
    return response.data
  },
)

const initialState: AuthState = {
  data: {
    isAuth: false,
  },
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state: AuthState) => {
      state.data.isAuth = true
      state.status = 'finished'
    })
    builder.addCase(login.rejected, (state: AuthState, action) => {
      state.error = action.error.message
      state.status = 'error'
    })
  },
})

export default authSlice.reducer
