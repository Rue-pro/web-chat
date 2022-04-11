import React, { memo, MouseEvent } from 'react'
import {
  Typography,
  styled,
  Box,
  TypographyProps,
  ButtonBaseProps,
  ButtonBase,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import { AvatarBadge, AvatarBadgeProps } from 'shared/ui'
import Template from './template'

export interface RowProps {
  id: string
  avatar: AvatarBadgeProps
  title: string
  message: string
  sentTime: string
  unreadedMessagesCount?: number
  onClick?: (e: MouseEvent<HTMLElement>) => void
  isCurrent?: boolean
}

const Row: React.FC<RowProps> = ({
  id,
  avatar,
  title,
  message,
  sentTime,
  unreadedMessagesCount,
  onClick,
  isCurrent = false,
}) => {
  return (
    <Container onClick={onClick} data-current={isCurrent}>
      <Template
        avatar={<AvatarBadge {...avatar} />}
        title={
          <Title variant="subtitle1" data-current={isCurrent}>
            {title}
          </Title>
        }
        message={<Message data-current={isCurrent}>{message}</Message>}
        info={
          <>
            <Time data-current={isCurrent}>{sentTime}</Time>
            {unreadedMessagesCount ? (
              <MessagesCount data-current={isCurrent}>
                {getMessagesCount(unreadedMessagesCount)}
              </MessagesCount>
            ) : (
              <DoneAllIcon color="primary" />
            )}
          </>
        }
      />
    </Container>
  )
}

export default memo(Row)

const getMessagesCount = (messagesCount: number) => {
  return messagesCount >= 100 ? '99+' : messagesCount
}

const Container = styled((props: ButtonBaseProps) => <ButtonBase {...props} />)`
  padding: 10px 24px;
  &[data-current='true'] {
    background-color: #1976d2;
  }

  &[data-current='false'] {
    background-color: #999999;
  }
`

const Time = styled(Box)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;

  &[data-current='true'] {
    color: #ffffff;
  }

  &[data-current='false'] {
    color: #999999;
  }
`

const MessagesCount = styled(Box)`
  font-size: 10px;
  line-height: 14px;
  font-weight: 600;
  color: #ffffff;

  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #14c686;
  border-radius: 50%;
`

const Title = styled((props: TypographyProps) => <Typography {...props} />)`
  &[data-current='true'] {
    color: #ffffff;
  }

  &[data-current='false'] {
    color: #000000;
  }
`

const Message = styled((props: TypographyProps) => <Typography {...props} />)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &[data-current='true'] {
    color: #ffffff;
  }

  &[data-current='false'] {
    color: #000000;
  }
`
