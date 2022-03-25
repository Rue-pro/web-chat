import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

type InputProps = TextFieldProps & {
  formName: string
  inputId: string
}

const Input: React.FC<InputProps> = ({ formName, inputId, ...rest }) => {
  return (
    <TextField id={formName + '_' + inputId} variant="standard" {...rest} />
  )
}

export default Input
