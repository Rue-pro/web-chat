import React from 'react'

import Chat from 'widgets/chat'
import { ChatTemplate } from 'shared/ui/template'
import { Profile } from 'entities/profile'

const HomePage: React.FC = () => {
  return <ChatTemplate title="Чат" aside={<Profile />} main={<Chat />} />
}

export default HomePage
