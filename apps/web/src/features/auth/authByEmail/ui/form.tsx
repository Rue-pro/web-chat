import React, { useCallback, useEffect, useState } from 'react'
import { Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'

import { TStore } from 'shared/store'
import { login } from 'shared/store/authSlice'
import { Schema } from '../model'
import FormView, { FormValues } from './formView'

interface FormProps {
  formName: string
  pageToNavigate: string
}

const Form: React.FC<FormProps> = ({ formName, pageToNavigate }) => {
  const dispatch = useDispatch()
  const { status, error, isAuth } = useSelector((state: TStore) => ({
    status: state.AuthReducer.status,
    error: state.AuthReducer.error,
    isAuth: state.AuthReducer.data.isAuth,
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
    switch (status) {
      case 'idle':
        isAuth && navigate(pageToNavigate)
        setSubmitting(false)
        break
      case 'error':
        setSubmitting(false)
        break
      default:
    }
  }, [navigate, pageToNavigate, status, isAuth])

  return (
    <>
      {status === 'error' && <Alert severity="error">{error}</Alert>}
      <Formik
        initialValues={{
          email: '',
          password: '',
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
