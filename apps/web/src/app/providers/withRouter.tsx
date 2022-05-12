import { Component, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { CircularProgress } from '@mui/material'

const withRouter = (component: () => Component) => () =>
  (
    <BrowserRouter>
      <Suspense fallback={<CircularProgress />}>{component()}</Suspense>
    </BrowserRouter>
  )

export default withRouter
