import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Stack, Box, styled, IconButton, BoxProps } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { ChatMessage } from 'entities/chatMessage'
import { throttle, dateToRuDate } from 'shared/lib'
import { TStore } from 'shared/store'
import { messagesActions } from 'shared/store/messages/messagesSlice'
import { colors } from 'shared/theme/colors'
import { DialogTypes } from 'shared/store/dialogs/types'

interface DialogProps extends BoxProps {}

const Dialog: React.FC<DialogProps> = ({ ...boxProps }) => {
  const dispatch = useDispatch()
  const { messages, userId, currentDialog } = useSelector((state: TStore) => {
    return {
      status: state.MessagesReducer.status,
      messages: state.MessagesReducer.data.messages,
      userId: state.AuthReducer.data.user.userId,
      currentDialog: state.DialogsReducer.data.currentDialog,
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
    if (currentDialog.type === DialogTypes.NEW_DIALOG) {
      dispatch(messagesActions.resetAllMessages())
    }
    if (currentDialog.type === DialogTypes.EXISTING_DIALOG) {
      dispatch(messagesActions.getAllMessages({ dialogId: currentDialog.id }))
    }
  }, [dispatch, currentDialog])

  return (
    <Container {...boxProps}>
      <MessagesContainer ref={containerRef}>
        {messages?.map(message => (
          <ChatMessage
            key={message.id}
            type={message.authorId === userId ? 'own' : 'theirs'}
            message={message.content}
            sentTime={dateToRuDate(new Date(message.createdAt))}
          />
        ))}
      </MessagesContainer>

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

const MessagesContainer = styled(Stack)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
`
const ButtonBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.gray[5]};
  border-radius: 50%;
`

const ScrollDownButton = styled(IconButton)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 0px 0px rgb(0 0 0 / 16%), 0 3px 6px rgb(0 0 0 / 23%);
`
