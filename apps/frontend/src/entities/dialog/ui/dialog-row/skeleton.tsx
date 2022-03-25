import React from 'react'
import { Box, Skeleton as MuiSkeleton, styled } from '@mui/material'
import Template from './template'

type SkeletonProps = {}

const Skeleton: React.FC<SkeletonProps> = () => {
  return (
    <Container>
      <Template
        avatar={<MuiSkeleton variant="circular" width={40} height={40} />}
        title={<MuiSkeleton height="1rem" sx={{ mb: '5px' }} />}
        message={<MuiSkeleton height="1rem" />}
        info={<MuiSkeleton height="12px" sx={{ width: '100%' }} />}
      />
    </Container>
  )
}

export default Skeleton

const Container = styled(Box)`
  padding: 8px 16px;
`
