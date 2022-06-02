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
import { colors } from 'shared/theme/colors'

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
          <Text variant="subtitle1" data-current={isCurrent}>
            {title}
          </Text>
        }
        message={<Text data-current={isCurrent}>{message}</Text>}
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
`

const Text = styled((props: TypographyProps) => <Typography {...props} />)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
`
