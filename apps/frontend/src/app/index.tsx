import React from 'react'
import CharactersPage from '../pages/characters'
import Toasts from './toasts'

const App: React.FC = () => {
  return (
    <>
      <CharactersPage />

      <Toasts />
    </>
  )
}

export default App
