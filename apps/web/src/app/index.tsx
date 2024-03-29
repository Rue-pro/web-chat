import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Pages from 'pages'
import { withProviders } from './providers'
import { TStore } from 'shared/store'
import { socketActions } from 'shared/store/socket/socketSlice'
import { RefreshTokensResultError, TokenService } from 'shared/lib'
import { authActions } from 'shared/store/auth/authSlice'
import { UserId } from 'shared/config'
import { Spinner } from 'shared/ui/spinner'

const App: React.FC = () => {
  const [refresingTokens, setRefreshingTokens] = useState(false)
  const dispatch = useDispatch()
  const { isAuth } = useSelector((state: TStore) => ({
    isAuth: state.AuthReducer.data.isAuth,
  }))

  const setAuth = useCallback(
    (userId: UserId) => {
      dispatch(authActions.setAuth({ userId }))
    },
    [dispatch],
  )

  useEffect(() => {
    async function refreshTokens() {
      setRefreshingTokens(true)
      const data = await TokenService.refreshTokens()
      if (typeof data === 'object') {
        setAuth(data.user.id)
      }
      if (data === RefreshTokensResultError.REFRESH_TOKEN_EXPIRED) {
        dispatch(authActions.logout())
      }
      setRefreshingTokens(false)
    }
    refreshTokens()
  }, [dispatch, setAuth])

  useEffect(() => {
    if (isAuth) dispatch(socketActions.startConnecting())
  }, [dispatch, isAuth])

  if (refresingTokens) {
    return <Spinner />
  }

  return <Pages />
}

export default withProviders(App)
