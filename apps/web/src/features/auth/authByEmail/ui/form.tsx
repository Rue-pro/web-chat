import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Stack, styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Formik } from 'formik'

import { TStore } from 'shared/store'
import { login } from 'shared/store//auth/authSlice'
import { Schema } from '../model'
import FormView, { FormValues } from './formView'
import { colors } from 'shared/theme/colors'

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
      console.log('VALUES', values)
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
    <Container>
      <Wrapper>
        {status === 'error' && (
          <Alert severity="error" sx={{ mb: '20px' }}>
            {error}
          </Alert>
        )}
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
      </Wrapper>
    </Container>
  )
}

export default Form

const Container = styled(Stack)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-bottom: 4px solid ${colors.primary};
`

const Wrapper = styled(Stack)`
  width: 350px;
`
