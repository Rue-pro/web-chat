import React, { memo, MouseEvent } from 'react'
import {
  Typography,
  styled,
  Box,
  TypographyProps,
  ButtonBaseProps,
  ButtonBase,
} from '@mui/material'

import { Avatar, AvatarProps } from 'shared/ui/avatar'
import { colors } from 'shared/theme/colors'
import Template from './template'

export interface Props {
  avatar: AvatarProps
  title: string
  message: string
  sentTime: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
  isCurrent?: boolean
}

const Row: React.FC<Props> = ({
  avatar,
  title,
  message,
  sentTime,
  onClick,
  isCurrent = false,
}) => (
  <Container onClick={onClick} data-current={isCurrent}>
    <Template
      avatar={<Avatar {...avatar} />}
      title={
        <Text variant="subtitle1" data-current={isCurrent}>
          {title}
        </Text>
      }
      message={<Text data-current={isCurrent}>{message}</Text>}
      info={<Time data-current={isCurrent}>{sentTime}</Time>}
    />
  </Container>
)

export default memo(Row)

const Container = styled((props: ButtonBaseProps) => <ButtonBase {...props} />)`
  width: 100%;
  padding: 10px 24px;
  &[data-current='true'] {
    border-left: 2px solid ${colors.primary};
  }

  &[data-current='false'] {
    border-left: 2px solid transparent;
  }
`

const Time = styled(Box)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  text-align: end;
`

const Text = styled((props: TypographyProps) => <Typography {...props} />)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
`
