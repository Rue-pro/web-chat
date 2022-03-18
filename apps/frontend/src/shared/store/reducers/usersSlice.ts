import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getUsers, TGetUsers } from '../../api'
import { User } from '../../types'

export const fetchUsers = createAsyncThunk('Users/fetchUsers', getUsers)

type GenericState<T> = {
  Users: T
  total: number
  status: 'loading' | 'idle' | 'error'
  error: string | null
}

type TPayload = User[]

const initialState: GenericState<TPayload> = {
  Users: [],
  total: 0,
  status: 'idle',
  error: null,
}

const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUsers.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<TGetUsers>) => {
        state.Users = action.payload.Users
        state.total = action.payload.total
        state.status = 'idle'
      },
    )
  },
})

export default UsersSlice.reducer
