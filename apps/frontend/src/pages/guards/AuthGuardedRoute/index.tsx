import React from 'react'
import { Navigate, Route, RouteProps } from 'react-router-dom'
import { emptyApi } from '../../../shared/api/endpoints/emptyApi'
import { PATHS } from '../../routes'

type AuthGuardedRouteProps = RouteProps

const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ ...rest }) => {
  const isAuth = false
  console.log(emptyApi)
  return isAuth ? <Route {...rest} /> : <Navigate to={PATHS.LoginPage} />
}

export default AuthGuardedRoute
