import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import AuthGuardedRoute from './guards/AuthGuardedRoute'
import { PAGES } from 'shared/config'

const HomePage = lazy(() => import('./home'))
const Error404Page = lazy(() => import('./error404'))
const ErrorBadGateway = lazy(() => import('./error502'))
const LoginPage = lazy(() => import('./login'))

const Pages = () => (
  <Routes>
    <Route
      path={PAGES.HomePage}
      element={
        <AuthGuardedRoute>
          <HomePage />
        </AuthGuardedRoute>
      }
    />
    <Route path={PAGES.NotFoundPage} element={<Error404Page />} />
    <Route path={PAGES.BadGatewayPage} element={<ErrorBadGateway />} />
    <Route path={PAGES.LoginPage} element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default Pages
