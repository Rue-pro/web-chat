import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Pages from 'pages'
import { withProviders } from './providers'
import { TStore } from 'shared/store'
import { socketActions } from 'shared/store/socketSlice'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector((state: TStore) => state.AuthReducer.data.isAuth)

  useEffect(() => {
    if (isAuth) dispatch(socketActions.startConnecting())
  }, [dispatch, isAuth])

  return <Pages />
}

export default withProviders(App)
