import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { PATHS } from 'shared/config/routes'
import { TStore } from 'shared/store'

interface AuthGuardedRouteProps {
  children: React.ReactNode
}

const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ children }) => {
  const isAuth = useSelector((state: TStore) => state.AuthReducer.data.isAuth)

  return isAuth ? <>{children}</> : <Navigate to={PATHS.LoginPage} />
}

export default AuthGuardedRoute
