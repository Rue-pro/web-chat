import React from 'react'
import { Skeleton as MuiSkeleton } from '@mui/material'

import Template from './template'

type Props = {}

const Skeleton: React.FC<Props> = () => (
  <Template
    avatar={<MuiSkeleton variant="circular" width={40} height={40} />}
    name={<MuiSkeleton height="1.75rem" />}
    phone={<MuiSkeleton height="1.75rem" />}
  />
)

export default Skeleton
