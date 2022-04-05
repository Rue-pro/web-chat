import React, { memo, MouseEvent } from 'react'
import {
  Typography,
  styled,
  Box,
  TypographyProps,
  ListItem,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'

import { AvatarBadge, AvatarBadgeProps } from 'shared/ui'
import Template from './template'

export type RowProps = {
  id: string
  avatar: AvatarBadgeProps
  title: string
  message: string
  sentTime: string
  unreadedMessagesCount?: number
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

const Row: React.FC<RowProps> = ({
  id,
  avatar,
  title,
  message,
  sentTime,
  unreadedMessagesCount,
  onClick,
}) => {
  return (
    <ListItem button data-id={id} onClick={onClick}>
      <Template
        avatar={<AvatarBadge {...avatar} />}
        title={
          <Typography variant="subtitle1" component="p">
            {title}
          </Typography>
        }
        message={<Message>{message}</Message>}
        info={
          <>
            <Time>{sentTime}</Time>
            {unreadedMessagesCount ? (
              <MessagesCount>
                {getMessagesCount(unreadedMessagesCount)}
              </MessagesCount>
            ) : (
              <DoneAllIcon color="primary" />
            )}
          </>
        }
      />
    </ListItem>
  )
}

export default memo(Row)

const getMessagesCount = (messagesCount: number) => {
  return messagesCount >= 100 ? '99+' : messagesCount
}

const Time = styled(Box)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #999999;
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

const Message = styled((props: TypographyProps) => <Typography {...props} />)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
