import React from 'react'
import {
  Typography,
  styled,
  Box,
  TypographyProps,
  ListItem,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { AvatarBadge } from '../../../../shared/ui'
import Template from './template'

const Row: React.FC = () => {
  return (
    <ListItem button>
      <Template
        avatar={
          <AvatarBadge
            src="https://mui.com/static/images/avatar/1.jpg"
            alt="Remy Sharp"
          />
        }
        title={
          <Typography variant="subtitle1" component="p">
            Remy Sharp
          </Typography>
        }
        message={
          <Message>
            Это сообщение отправил Remy Sharp. Его еще не прочитали Это
            сообщение отправил Remy Sharp. Его еще не прочитали Это сообщение
            отправил Remy Sharp. Его еще не прочитали Это сообщение отправил
            Remy Sharp. Его еще не прочитали Это сообщение отправил Remy Sharp.
            Его еще не прочитали Это сообщение отправил Remy Sharp. Его еще не
            прочитали
          </Message>
        }
        info={
          <>
            <Time>10:58 25.12.21</Time>
            <DoneAllIcon color="primary" />
            <MessagesCount>99+</MessagesCount>
          </>
        }
      />
    </ListItem>
  )
}

export default Row

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
