import { ChatMessage } from 'entities/chatMessage/ui'
import * as React from 'react'

import { useGetMessagesQuery } from 'shared/api/endpoints/messagesApi'

interface DialogProps {
  id: string | null
}

const Dialog: React.FC<DialogProps> = () => {
  const { data: messages, isLoading } = useGetMessagesQuery()

  if (isLoading) {
    return <div>Показываю скелетон</div>
  }

  return (
    <>
      {messages?.map(message => (
        <ChatMessage
          key={message.id}
          type="own"
          message={message.content}
          sentTime={'10:56'}
        />
      ))}
    </>
  )
}

export default Dialog
