import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { TStore } from 'app/store'
import { PATHS } from 'pages/routes'

type AuthGuardedRouteProps = {
  children: React.ReactNode
}

const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ children }) => {
  const isAuth = useSelector((state: TStore) => {
    return state.AuthReducer.data.isAuth
  })
  return isAuth ? <>{children}</> : <Navigate to={PATHS.LoginPage} />
}

export default AuthGuardedRoute
