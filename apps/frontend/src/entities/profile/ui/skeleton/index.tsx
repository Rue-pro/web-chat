import React from 'react'
import { Box, Skeleton as MuiSkeleton, styled } from '@mui/material'
import { ProfileTemplate } from '..'

type SkeletonProps = {}

const Skeleton: React.FC<SkeletonProps> = () => (
  <ProfileTemplate
    avatar={<MuiSkeleton variant="circular" width={40} height={40} />}
    name={<MuiSkeleton height="1.75rem" />}
    phone={<MuiSkeleton height="1.75rem" />}
  />
)

export default Skeleton
