import React from 'react'
import { FormikProps } from 'formik'
import { Stack, styled } from '@mui/material'

import { Input } from 'shared/ui/input'
import { ActionButton } from 'shared/ui/button'

export type FormValues = {
  email: string
  password: string
}

interface FormViewProps extends FormikProps<FormValues> {
  formName: string
}

const FormView = ({
  formName,
  setFieldValue,
  values,
  errors,
  submitForm,
  isSubmitting,
}: FormViewProps): React.ReactElement => {
  return (
    <Container>
      <Input
        formName={formName}
        inputId="email"
        label="Email"
        value={values.email}
        onChange={e => setFieldValue('email', e.target.value)}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />
      <Input
        formName={formName}
        inputId="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={e => setFieldValue('password', e.target.value)}
        error={Boolean(errors.password)}
        helperText={errors.password}
      />
      <ActionButton type="submit" disabled={isSubmitting} onClick={submitForm}>
        Sign In
      </ActionButton>
    </Container>
  )
}

export default FormView

const Container = styled(Stack)`
  width: 350px;
`
