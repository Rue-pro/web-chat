import React, { useEffect } from 'react'
import Pages from '../pages'
import { useGetJWTTokenMutation } from '../shared/api/endpoints/sessionApi'
import { withProviders } from './providers'

/**
 * Sean_Quigley99@gmail.com
 * ErvEiVySQZSyPTh
 */
const App: React.FC = () => {
  const [getJWTToken] = useGetJWTTokenMutation()

  useEffect(() => {
    getJWTToken({
      email: 'Sean_Quigley99@gmail.com',
      password: 'ErvEiVySQZSyPTh',
    })
  }, [])

  return <Pages />
}

export default withProviders(App)
