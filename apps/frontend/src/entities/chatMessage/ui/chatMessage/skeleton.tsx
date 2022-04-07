import React from 'react'
import { Skeleton as MuiSkeleton } from '@mui/material'

type SkeletonProps = {}

const Skeleton: React.FC<SkeletonProps> = () => (
  <MuiSkeleton height="100px" sx={{ width: '100%' }} />
)

export default Skeleton
