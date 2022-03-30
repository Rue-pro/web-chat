import React from 'react'
import { Box, styled, Typography } from '@mui/material'

type ChatMessageType = 'own' | 'their'

type ChatMessageProps = {
  type: ChatMessageType
  message: string
  sentTime: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  message,
  sentTime,
}: ChatMessageProps) => {
  return (
    <Container data-type={type}>
      <Message data-type={type}>{message}</Message>
      <Time data-type={type}>{sentTime}</Time>
    </Container>
  )
}

export default ChatMessage

const Container = styled(Box)`
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  width: 70%;
  padding: 16px;
  margin-bottom: 20px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid;
  }

  &[data-type='own'] {
    align-self: flex-end;
    margin-right: 10px;
    background-color: #009ed1;

    &::after {
      right: -6px;
      border-top-color: #009ed1;
    }
  }

  &[data-type='their'] {
    align-self: flex-start;
    margin-left: 10px;
    background-color: #e5f7fd;

    &::after {
      left: -6px;
      border-top-color: #e5f7fd;
    }
  }
`

const Time = styled(Typography)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;

  &[data-type='own'] {
    color: #ffffff;
  }

  &[data-type='their'] {
    color: #999999;
  }
`

const Message = styled(Typography)`
  font-size: 14px;
  line-height: 19px;
  font-weight: 400;
  margin-bottom: 20px;
  word-break: break-word;

  &[data-type='own'] {
    color: #ffffff;
  }

  &[data-type='their'] {
    color: #666666;
  }
`
