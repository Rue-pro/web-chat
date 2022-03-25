import React from 'react'
import { Box, styled, Typography } from '@mui/material'

type ChatMessageType = 'own' | 'their'

type ChatMessageProps = {
  type: ChatMessageType
  message: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  message,
}: ChatMessageProps) => {
  const Container = getContainerByType(type)
  const Message = getMessageByType(type)
  const Time = getTimeByType(type)
  return (
    <Container>
      <Message>{message}</Message>
      <Time>10:56</Time>
    </Container>
  )
}

export default ChatMessage

const getContainerByType = (type: ChatMessageType) => {
  switch (type) {
    case 'own':
      return OwnMessageContainer
    case 'their':
      return TheirMessageContainer
  }
}

const getMessageByType = (type: ChatMessageType) => {
  switch (type) {
    case 'own':
      return OwnMessage
    case 'their':
      return TheirMessage
  }
}

const getTimeByType = (type: ChatMessageType) => {
  switch (type) {
    case 'own':
      return OwnTime
    case 'their':
      return TheirTime
  }
}

const OwnTime = styled(Typography)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #ffffff;
`

const TheirTime = styled(OwnTime)`
  color: #999999;
`

const OwnMessage = styled(Typography)`
  font-size: 14px;
  line-height: 19px;
  font-weight: 400;
  margin-bottom: 20px;
  word-break: break-word;
  color: #ffffff;
`

const TheirMessage = styled(OwnMessage)`
  color: #666666;
`

const OwnMessageContainer = styled(Box)`
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  width: 70%;
  padding: 16px;
  background-color: #009ed1;
  align-self: flex-end;
  margin-right: 10px;
  margin-bottom: 20px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -6px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid #009ed1;
  }
`

const TheirMessageContainer = styled(OwnMessageContainer)`
  align-self: flex-start;
  margin-right: 0;
  margin-left: 10px;
  background-color: #e5f7fd;
  align-self: left;

  &::after {
    left: -6px;
    right: none;
    border-top-color: #e5f7fd;
  }
`
