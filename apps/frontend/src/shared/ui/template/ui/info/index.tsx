import React from 'react'
import { styled, Typography, Box } from '@mui/material'

interface InfoTemplateProps {
  children: string
}

const InfoTemplate: React.FC<InfoTemplateProps> = ({ children }) => {
  return (
    <Container>
      <TextContainer>
        <Typography variant="body1" component="span">
          {children}
        </Typography>
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
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
`
