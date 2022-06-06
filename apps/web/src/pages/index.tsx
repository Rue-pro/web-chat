import { lazy } from 'react'
import { Route, Routes } from 'react-router'

import AuthGuardedRoute from './guards/AuthGuardedRoute'
import { PAGES } from 'shared/config'

const HomePage = lazy(() => import('./home'))
const Error404Page = lazy(() => import('./error404'))
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
    <Route path={PAGES.LoginPage} element={<LoginPage />} />
    <Route path="*" element={<Error404Page />} />
  </Routes>
)

export default Pages
