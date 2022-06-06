import React, { memo, ReactElement, Fragment } from 'react'
import { Box, Divider } from '@mui/material'

interface Props {
  skeleton: React.ReactElement
  skeletonsCount: number
}

const getSkeletons = (
  skeleton: ReactElement,
  skeletonsCount: number,
): ReactElement[] => {
  const skeletons: ReactElement[] = []
  for (let i = 0; i < skeletonsCount; i++) {
    skeletons.push(
      <Fragment key={i}>
        {skeleton}
        <Divider />
      </Fragment>,
    )
  }
  return skeletons
}

const DialogLoadingTemplate: React.FC<Props> = ({
  skeleton,
  skeletonsCount,
}) => <Box>{getSkeletons(skeleton, skeletonsCount)}</Box>

export default memo(DialogLoadingTemplate)
