import React, { memo } from 'react'
import { Avatar as MuiAvatar, Stack } from '@mui/material'

export interface Props {
  src: string
  alt: string
}

const Avatar: React.FC<Props> = ({ src, alt }) => (
  <Stack direction="row" spacing={2}>
    <MuiAvatar alt={alt} src={src} />
  </Stack>
)

export default memo(Avatar)
