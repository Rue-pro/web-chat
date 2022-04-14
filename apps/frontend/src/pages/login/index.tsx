import React from 'react'

import { PAGES } from 'shared/config'
import { AuthByEmailForm } from 'features/auth/authByEmail'

const LoginPage: React.FC = () => (
  <div>
    <AuthByEmailForm formName="auth-form" pageToNavigate={PAGES.HomePage} />
  </div>
)

export default LoginPage
