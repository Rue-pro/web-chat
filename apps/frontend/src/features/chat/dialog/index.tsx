import React from 'react'

import { ChatMessage, ChatMessageSkeleton } from 'entities/chatMessage/ui'
import { useGetMessagesQuery } from 'shared/api/endpoints/messagesApi'
import { timeStampToRuDate } from 'shared/lib'

interface DialogProps {
  id: string
}

const Dialog: React.FC<DialogProps> = ({ id }) => {
  const { data: messages, isLoading } = useGetMessagesQuery(id, {
    skip: !Boolean(id),
  })

  console.log('MESSAGES', messages)
  if (isLoading) {
    return (
      <>
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
      </>
    )
  }

  return (
    <>
      {messages?.map(message => (
        <ChatMessage
          key={message.id}
          type={message.owner}
          message={message.content}
          sentTime={timeStampToRuDate(message.createdAt)}
        />
      ))}
    </>
  )
}

export default Dialog
