import { API_URL } from 'shared/config/environment-variables'
import { io, Socket as IOSocket } from 'socket.io-client'

class Socket {
  private _socket: IOSocket

  constructor() {
    this._socket = io(API_URL, {
      withCredentials: true,
      path: '/messages',
    })
  }

  get instance(): IOSocket {
    return this._socket
  }
}

export default new Socket()