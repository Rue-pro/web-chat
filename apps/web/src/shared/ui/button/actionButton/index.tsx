import React from 'react'
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  styled,
} from '@mui/material'

import { borderRadius } from 'shared/theme/common'

const Button: React.FC<MuiButtonProps> = props => (
  <StyledButton variant="contained" {...props} />
)

export default Button

const StyledButton = styled(MuiButton)`
  text-transform: none;
  border-radius: ${`${borderRadius[0]}px`};
  padding-top: 12px;
  padding-bottom: 12px;
`
