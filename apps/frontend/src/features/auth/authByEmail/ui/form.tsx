import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'

import { TStore } from 'app/store'
import { login } from 'shared/store/authSlice'
import { Schema } from '../model'
import FormView, { FormValues } from './formView'

type FormProps = {
  formName: string
  pageToNavigate: string
}

const Form: React.FC<FormProps> = ({ formName, pageToNavigate }) => {
  const dispatch = useDispatch()
  const auth = useSelector((state: TStore) => ({
    status: state.AuthReducer.status,
    error: state.AuthReducer.error,
  }))
  const navigate = useNavigate()

  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(
    (values: FormValues) => {
      setSubmitting(true)
      dispatch(login(values))
    },
    [dispatch],
  )

  useEffect(() => {
    switch (auth.status) {
      case 'finished':
        navigate(pageToNavigate)
        break
      case 'error':
        setSubmitting(false)
        break
      default:
    }
  }, [navigate, pageToNavigate, auth.status])

  return (
    <>
      {auth.status === 'error' && <Alert severity="error">{auth.error}</Alert>}
      <Formik
        initialValues={{
          email: 'Naomi.Buckridge34@hotmail.com',
          password: '9hgEyoMCkP9u7xf',
        }}
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
