import React from 'react'
import { AuthByEmailForm } from '../../features/auth/authByEmail'

const LoginPage: React.FC = () => (
  <>
    <div>
      Unprotected page
      <AuthByEmailForm formName="auth-form" />
    </div>
  </>
)

export default LoginPage
