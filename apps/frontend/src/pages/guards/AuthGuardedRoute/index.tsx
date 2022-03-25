import React from 'react'
import { Navigate } from 'react-router-dom'
import { PATHS } from '../../routes'

type AuthGuardedRouteProps = {
  children: React.ReactNode
}

const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ children }) => {
  const isAuth = true
  return isAuth ? <>{children}</> : <Navigate to={PATHS.LoginPage} />
}

export default AuthGuardedRoute
