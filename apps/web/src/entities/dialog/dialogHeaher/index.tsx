import React from 'react'
import { IconButton, styled, Typography, TypographyProps } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { colors } from 'shared/theme/colors'
import { Container as DefaultContainer } from 'shared/ui/contianer'

interface Props {
  title: string
  onGoBack: () => void
}
const Header: React.FC<Props> = ({ title, onGoBack }) => {
  return (
    <Container>
      <IconButton onClick={onGoBack}>
        <ArrowBackIcon />
      </IconButton>
      <Text variant="subtitle1">{title}</Text>
    </Container>
  )
}
export default Header

const Container = styled(DefaultContainer)`
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  border-bottom: 2px solid ${colors.primary};
  margin-bottom: 20px;
`

const Text = styled((props: TypographyProps) => <Typography {...props} />)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
`
