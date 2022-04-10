import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Stack, Box, styled, IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { ChatMessage, ChatMessageSkeleton } from 'entities/chatMessage/ui'
import { throttle, timeStampToRuDate } from 'shared/lib'
import { chatActions, Message } from 'shared/store/messagesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { TStore } from 'shared/store'

interface DialogProps {
  id: string
}

const Dialog: React.FC<DialogProps> = ({ id }) => {
  const dispatch = useDispatch()
  const { status, messages, userId } = useSelector((state: TStore) => {
    return {
      status: state.MessagesReducer.status,
      messages: state.MessagesReducer.messages,
      userId: state.AuthReducer.data.userId,
    }
  })

  const containerRef = useRef<HTMLDivElement>()
  const [scrolledUpByUser, setScrolledUpByUser] = useState<boolean>(false)

  const handleScroll = throttle(() => {
    const container = containerRef.current
    if (container) {
      if (container.scrollHeight - container.scrollTop <= 1000) {
        setScrolledUpByUser(false)
      } else {
        setScrolledUpByUser(true)
      }
    }
  }, 1000)

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)

      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  useEffect(() => {
    const container = containerRef.current
    if (container && !scrolledUpByUser) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, scrolledUpByUser])

  useEffect(() => {
    dispatch(chatActions.getAllMessages({ userId: id }))
  }, [dispatch, id])

  if (status === 'loading') {
    return (
      <>
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
        <ChatMessageSkeleton />
      </>
    )
  }

  return (
    <Container>
      <Stack
        ref={containerRef}
        sx={{ height: '700px', width: '100%', overflowY: 'auto' }}>
        {messages?.map((message: Message) => (
          <ChatMessage
            key={message.id}
            type={message.authorId === userId ? 'own' : 'theirs'}
            message={message.content}
            sentTime={timeStampToRuDate(message.createdAt)}
          />
        ))}
      </Stack>

      {scrolledUpByUser && (
        <ScrollDownButton onClick={scrollToBottom}>
          <ButtonBackground></ButtonBackground>
          <KeyboardArrowDownIcon sx={{ zIndex: 1 }} fontSize="large" />
        </ScrollDownButton>
      )}
    </Container>
  )
}

export default Dialog

const Container = styled(Box)`
  position: relative;
`

const ButtonBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 50%;
`

const ScrollDownButton = styled(IconButton)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 0px 0px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
`
