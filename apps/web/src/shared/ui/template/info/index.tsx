import React from 'react'
import { styled, Typography, Box } from '@mui/material'

import { colors } from 'shared/theme/colors'

interface Props {
  children: string
}

const InfoTemplate: React.FC<Props> = ({ children }) => {
  return (
    <Container>
      <TextContainer>
        <Typography variant="body1">{children}</Typography>
      </TextContainer>
    </Container>
  )
}

export default InfoTemplate

const Container = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TextContainer = styled(Box)`
  padding: 8px 16px;
  background-color: ${colors.gray[4]};
  border-radius: 20px;
`
