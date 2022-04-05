import React from 'react'

import { ChatMessage } from 'entities/chatMessage/ui'
import { useGetMessagesQuery } from 'shared/api/endpoints/messagesApi'

interface DialogProps {
  id: string
}

const Dialog: React.FC<DialogProps> = ({ id }) => {
  const { data: messages, isLoading } = useGetMessagesQuery(id, {
    skip: !Boolean(id),
  })

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
