import { createSlice } from '@reduxjs/toolkit'

interface SocketState {
  isEstablishingConnection: boolean
  isConnectionEstablished: boolean
}

const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnectionEstablished: false,
}

const socketSlice = createSlice({
  name: 'socket',
  initialState: initialState,
  reducers: {
    startConnecting: state => {
      console.log('START_CINNECTING')
      state.isEstablishingConnection = true
    },
    connectionEstablished: state => {
      console.log('CONNECTION_ESTABLISHED')
      state.isConnectionEstablished = true
      state.isEstablishingConnection = false
    },
  },
})

export const socketActions = socketSlice.actions
export default socketSlice.reducer
