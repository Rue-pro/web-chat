import React from 'react'
import { Box } from '@mui/material'

import Chat from 'widgets/chat'
import Template from 'shared/ui/template'
import { Profile } from 'entities/profile'

const HomePage: React.FC = () => {
  return (
    <>
      <Template
        title="Чат"
        aside={<Profile />}
        main={
          <>
            <div>Protected page</div>
            <Chat />
          </>
        }
      />
    </>
  )
}

export default HomePage
