import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Pages from 'pages'
import { withProviders } from './providers'
import { TStore } from 'shared/store'
import { socketActions } from 'shared/store/socketSlice'
import { refreshToken } from 'shared/store/authSlice'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuth, needRefresh, isConnected } = useSelector((state: TStore) => ({
    isAuth: state.AuthReducer.data.isAuth,
    needRefresh: state.AuthReducer.data.needRefresh,
    isConnected: state.SocketReducer.isConnectionEstablished,
  }))

  useEffect(() => {
    if (needRefresh) {
      dispatch(refreshToken())
    }
  }, [needRefresh, dispatch])

  useEffect(() => {
    if (isAuth) dispatch(socketActions.startConnecting())
  }, [dispatch, isAuth])

  console.log('IS_AUTH', isAuth)
  console.log('IS_CONNECTED', isConnected)

  return <Pages />
}

export default withProviders(App)
