import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getCharacters, TGetCharacters } from '../../api'
import { Character } from '../../types'

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  getCharacters,
)

type GenericState<T> = {
  characters: T
  total: number
  status: 'loading' | 'idle' | 'error'
  error: string | null
}

type TPayload = Character[]

const initialState: GenericState<TPayload> = {
  characters: [],
  total: 0,
  status: 'idle',
  error: null,
}

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCharacters.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(
      fetchCharacters.fulfilled,
      (state, action: PayloadAction<TGetCharacters>) => {
        state.characters = action.payload.characters
        state.total = action.payload.total
        state.status = 'idle'
      },
    )
  },
})

export default charactersSlice.reducer
