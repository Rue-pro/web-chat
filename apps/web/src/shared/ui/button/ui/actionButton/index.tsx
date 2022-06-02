import React from 'react'
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  styled,
} from '@mui/material'

const Button: React.FC<MuiButtonProps> = props => {
  return <StyledButton variant="contained" {...props} />
}

export default Button

const StyledButton = styled(MuiButton)`
  text-transform: none;
  border-radius: 40px;
  padding-top: 12px;
  padding-bottom: 12px;
`
