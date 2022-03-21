import { lazy } from 'react'
import { Route, Routes } from 'react-router'

const HomePage = lazy(() => import('./home'))
const Error404Page = lazy(() => import('./error404'))

// TODO: Сделать работу с хедером на уровне pages

// TODO: Add auth zone restricting
// TODO: Add query-params provider
// TODO: decompose into app/hocs? (withRouter)

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/404" element={<Error404Page />} />
    </Routes>
  )
}

export default Pages
