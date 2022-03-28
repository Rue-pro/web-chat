import React from 'react'

import { PATHS } from 'pages/routes'
import { AuthByEmailForm } from 'features/auth/authByEmail'

const LoginPage: React.FC = () => (
  <>
    <div>
      Unprotected page
      <AuthByEmailForm formName="auth-form" pageToNavigate={PATHS.HomePage} />
    </div>
  </>
)

export default LoginPage
