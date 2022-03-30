import React from 'react'
import Pages from 'pages'
import { withProviders } from './providers'

const App: React.FC = () => {
  return <Pages />
}

export default withProviders(App)
