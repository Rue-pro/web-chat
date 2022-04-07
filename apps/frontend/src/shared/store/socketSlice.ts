import { createSlice } from '@reduxjs/toolkit'

interface SocketState {
  isEstablishingConnection: boolean
  isConnected: boolean
}

const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnected: false,
}

const socketSlice = createSlice({
  name: 'socket',
  initialState: initialState,
  reducers: {
    startConnecting: state => {
      state.isEstablishingConnection = true
    },
    connectionEstablished: state => {
      state.isConnected = true
      state.isEstablishingConnection = true
    },
  },
})

export const socketActions = socketSlice.actions
export default socketSlice.reducer
