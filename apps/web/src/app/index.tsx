import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Pages from 'pages'
import { withProviders } from './providers'
import { TStore } from 'shared/store'
import { socketActions } from 'shared/store/socketSlice'
import { TokenService } from 'shared/services'
import { authActions } from 'shared/store/authSlice'

const App: React.FC = () => {
  const [refresingTokens, setRefreshingTokens] = useState(false)
  const dispatch = useDispatch()
  const { isAuth, isConnected } = useSelector((state: TStore) => ({
    isAuth: state.AuthReducer.data.isAuth,
    isConnected: state.SocketReducer.isConnectionEstablished,
  }))

  const setAuth = useCallback(() => {
    dispatch(authActions.setAuth)
  }, [dispatch])

  useEffect(() => {
    async function refreshTokens() {
      setRefreshingTokens(true)
      const response = await TokenService.refreshTokens(setAuth)
      console.log('APP_REFRESH_TOKEN:', response)
      setRefreshingTokens(false)
    }
    refreshTokens()
  }, [isAuth, setAuth])

  useEffect(() => {
    if (isAuth) dispatch(socketActions.startConnecting())
  }, [dispatch, isAuth])

  console.group('[APP_INDEX]')
  console.log('IS_AUTH', isAuth)
  console.log('IS_CONNECTED', isConnected)
  console.groupEnd()

  if (refresingTokens) {
    return <h1>ОБНОВЛЯЮ ТОКЕНЫ</h1>
  }
  return <Pages />
}

export default withProviders(App)
