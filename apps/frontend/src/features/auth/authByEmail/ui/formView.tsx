import React from 'react'
import { FormikProps, Form } from 'formik'
import { ActionButton, Input } from '../../../../shared/ui'

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
  ...rest
}: FormViewProps): React.ReactElement => {
  console.log(isSubmitting)
  console.log(rest)
  return (
    <Form>
      <div>
        <Input
          formName={formName}
          inputId="email"
          label="Email"
          value={values.email}
          onChange={e => setFieldValue('email', e.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
      </div>
      <div>
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
      </div>
      <ActionButton type="submit" disabled={isSubmitting} onClick={submitForm}>
        Войти
      </ActionButton>
    </Form>
  )
}

export default FormView
