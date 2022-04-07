import React, { useEffect } from 'react'

import { ChatMessage, ChatMessageSkeleton } from 'entities/chatMessage/ui'
import { timeStampToRuDate } from 'shared/lib'
import { chatActions, Message } from 'shared/store/messagesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { TStore } from 'shared/store'

interface DialogProps {
  id: string
}

const Dialog: React.FC<DialogProps> = ({ id }) => {
  const dispatch = useDispatch()
  const { messages, userId } = useSelector((state: TStore) => {
    return {
      messages: state.MessagesReducer.messages,
      userId: state.AuthReducer.data.userId,
    }
  })

  useEffect(() => {
    dispatch(chatActions.getAllMessages({ userId: id }))
  }, [dispatch, id])

  /*if (isLoading) {
    return (
      <>
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
      </>
    )
  }*/

  return (
    <>
      {messages?.map((message: Message) => (
        <ChatMessage
          key={message.id}
          type={message.authorId === userId ? 'own' : 'theirs'}
          message={message.content}
          sentTime={timeStampToRuDate(message.createdAt)}
        />
      ))}
    </>
  )
}

export default Dialog
