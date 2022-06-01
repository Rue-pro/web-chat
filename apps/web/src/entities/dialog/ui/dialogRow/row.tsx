import React, { memo, MouseEvent } from 'react'
import {
  Typography,
  styled,
  Box,
  TypographyProps,
  ButtonBaseProps,
  ButtonBase,
} from '@mui/material'

import { AvatarBadge, AvatarBadgeProps } from 'shared/ui'
import Template from './template'

export interface RowProps {
  avatar: AvatarBadgeProps
  title: string
  message: string
  sentTime: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
  isCurrent?: boolean
}

const Row: React.FC<RowProps> = ({
  avatar,
  title,
  message,
  sentTime,
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
        info={<Time data-current={isCurrent}>{sentTime}</Time>}
      />
    </Container>
  )
}

export default memo(Row)

const Container = styled((props: ButtonBaseProps) => <ButtonBase {...props} />)`
  width: 100%;
  padding: 10px 24px;
  &[data-current='true'] {
    background-color: #1976d2;
  }

  &[data-current='false'] {
    background-color: transparent;
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
