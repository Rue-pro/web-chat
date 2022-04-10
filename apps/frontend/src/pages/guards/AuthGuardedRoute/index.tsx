import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

import { PATHS } from 'shared/config/routes'
import { ActionButton } from 'shared/ui'
import { logout } from 'shared/store/authSlice'
import { TStore } from 'shared/store'

interface AuthGuardedRouteProps {
  children: React.ReactNode
}

const AuthGuardedRoute: React.FC<AuthGuardedRouteProps> = ({ children }) => {
  const dispatch = useDispatch()
  const isAuth = useSelector((state: TStore) => state.AuthReducer.data.isAuth)
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    dispatch(logout())
    navigate(PATHS.LoginPage)
  }, [dispatch, navigate])

  return isAuth ? (
    <>
      {children}
      <div>
        <ActionButton onClick={handleClick}>Выйти</ActionButton>
      </div>
    </>
  ) : (
    <Navigate to={PATHS.LoginPage} />
  )
}

export default AuthGuardedRoute
