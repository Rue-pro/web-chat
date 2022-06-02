import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { PAGES } from 'shared/config'
import { TStore } from 'shared/store'
import { AuthByEmailForm } from 'features/auth/authByEmail'

const LoginPage: React.FC = () => {
  const isAuth = useSelector((state: TStore) => state.AuthReducer.data.isAuth)
  console.log('LOGIN_PAGE', isAuth)

  return (
    <AuthByEmailForm formName="auth-form" pageToNavigate={PAGES.HomePage} />
  )
}

export default LoginPage
