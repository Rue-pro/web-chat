import React from 'react'
import { styled, TextField, TextFieldProps } from '@mui/material'

import { colors } from 'shared/theme/colors'
import { borderRadius } from 'shared/theme/common'

type Props = TextFieldProps & {
  formName: string
  inputId: string
}

const Input: React.FC<Props> = ({ formName, inputId, ...rest }) => (
  <InputStyled id={formName + '_' + inputId} variant="filled" {...rest} />
)

export default Input

const InputStyled = styled(TextField)`
  margin-bottom: 20px;
  & .MuiInputBase-root {
    background-color: ${colors.gray[0]};
    border-radius: ${`${borderRadius[0]}px`};
    &::before {
      content: none;
    }
    &::after {
      display: none;
    }

    & input {
      padding-left: 22px;
      padding-right: 22px;

      &:-webkit-autofill {
        border-radius: ${`${borderRadius[0]}px`};
        box-shadow: ${`0 0 0 100px ${colors.gray[1]} inset`};
      }
    }
  }
  & .MuiInputLabel-root {
    max-width: calc(100% - 44px);
    left: 10px;
  }
`
