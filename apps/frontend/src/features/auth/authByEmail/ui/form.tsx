import React from 'react'
import { Formik } from 'formik'

import { Schema } from '../model'
import FormView, { FormValues } from './formView'

type FormProps = {
  formName: string
}

const Form: React.FC<FormProps> = ({ formName }) => {
  const handleSubmit = async function (values: FormValues) {
    await new Promise(resolve => setTimeout(resolve, 4000))
    console.log(values)
  }

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Schema}
      onSubmit={handleSubmit}
      component={props => <FormView formName={formName} {...props} />}
    />
  )
}

export default Form
