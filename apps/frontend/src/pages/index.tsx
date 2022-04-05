import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'

import AuthGuardedRoute from './guards/AuthGuardedRoute'
import { PATHS } from './routes'

const HomePage = lazy(() => import('./home'))
const Error404Page = lazy(() => import('./error404'))
const LoginPage = lazy(() => import('./login'))

const Pages = () => (
  <Routes>
    <Route
      path={PATHS.HomePage}
      element={
        <AuthGuardedRoute>
          <HomePage />
        </AuthGuardedRoute>
      }
    />
    <Route path={PATHS.NotFoundPage} element={<Error404Page />} />
    <Route path={PATHS.LoginPage} element={<LoginPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default Pages
