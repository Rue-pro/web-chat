import React, { ReactElement } from 'react'
import { Route, RouteProps, Navigate } from 'react-router-dom'

type GuardedRouteProps = RouteProps & {
  element: ReactElement
  isAuthenticated: boolean
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({
  element,
  isAuthenticated,
  ...rest
}) =>
  isAuthenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Route path="*" element={<Navigate to="/login" replace />} />
  )

export default GuardedRoute
