import React, { useState } from 'react'
import { Formik } from 'formik'

import { Schema } from '../model'
import FormView, { FormValues } from './formView'
import { login } from '../../../../shared/api'
import { Alert } from '@mui/material'

type FormProps = {
  formName: string
}

const Form: React.FC<FormProps> = ({ formName }) => {
  const [error, setError] = useState(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const handleSubmit = function (values: FormValues) {
    setSubmitting(true)
    login(values)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        setSubmitting(false)
        if (error.response) {
          console.log('Request made and server responded', error.response.data)
          setError(error.response.data.message)
        } else if (error.request) {
          console.log(
            'The request was made but no response was received',
            error.request,
          )
        } else {
          console.log(
            'Something happened in setting up the request that triggered an Error',
            error.message,
          )
        }
      })
  }

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Schema}
        onSubmit={handleSubmit}
        component={props => (
          <FormView
            {...props}
            formName={formName}
            isSubmitting={isSubmitting}
          />
        )}
      />
    </>
  )
}

export default Form
