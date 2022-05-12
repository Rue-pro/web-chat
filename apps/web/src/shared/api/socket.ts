import { io, Socket as IOSocket } from 'socket.io-client'

import { API_URL } from 'shared/config'

class Socket {
  private _socket: IOSocket

  constructor() {
    this._socket = io(API_URL, {
      withCredentials: true,
      path: '/messages',
      transports: ['websocket', 'polling', 'flashsocket'],
    })
  }

  get instance(): IOSocket {
    return this._socket
  }
}

export default new Socket()
