import * as Yup from 'yup'

export const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address format')
    .required('Email is required'),
  password: Yup.string()
    .min(12, 'Password must be 12 characters at minimum')
    .required('Password is required'),
})
