import React from 'react'
import { styled, TextField, TextFieldProps } from '@mui/material'
import { colors } from 'shared/theme/colors'

type InputProps = TextFieldProps & {
  formName: string
  inputId: string
}

const Input: React.FC<InputProps> = ({ formName, inputId, ...rest }) => {
  return (
    <InputStyled id={formName + '_' + inputId} variant="filled" {...rest} />
  )
}

export default Input

const InputStyled = styled(TextField)`
  margin-bottom: 20px;
  & .MuiInputBase-root {
    background-color: ${colors.gray[0]};
    border-radius: 40px;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }

    & input {
      padding-left: 22px;
      padding-right: 22px;
    }
  }
  & .MuiInputLabel-root {
    max-width: calc(100% - 40px);
    left: 10px;
  }
`
