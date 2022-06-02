import React from 'react'
import { Box, styled, Typography } from '@mui/material'

import { MessageOwner } from 'shared/store/messagesSlice'
import { colors } from 'shared/theme/colors'

interface ChatMessageProps {
  type: MessageOwner
  message: string
  sentTime: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  message,
  sentTime,
}: ChatMessageProps) => (
  <Container data-type={type}>
    <Message data-type={type}>{message}</Message>
    <Time data-type={type}>{sentTime}</Time>
  </Container>
)

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
    background-color: ${colors.pink};

    &::after {
      right: -6px;
      border-top-color: ${colors.pink};
    }
  }

  &[data-type='theirs'] {
    align-self: flex-start;
    margin-left: 10px;
    background-color: ${colors.gray[5]};

    &::after {
      left: -6px;
      border-top-color: ${colors.gray[5]};
    }
  }
`

const Time = styled(Typography)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
`

const Message = styled(Typography)`
  font-size: 14px;
  line-height: 19px;
  font-weight: 400;
  margin-bottom: 20px;
  word-break: break-word;
`
