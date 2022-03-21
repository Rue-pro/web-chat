import { Component, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'

const withRouter = (component: () => Component) => () =>
  (
    <BrowserRouter>
      <Suspense fallback={<div>Гружу</div>}>{component()}</Suspense>
    </BrowserRouter>
  )

export default withRouter
