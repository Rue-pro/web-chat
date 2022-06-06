import { useEffect } from 'react'
import { miniSerializeError, SerializedError } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const useToastError = (error?: SerializedError) => {
  useEffect(() => {
    if (!error) return

    const parsedError = miniSerializeError(error)
    if (!parsedError.message) return

    const err = JSON.parse(parsedError.message)
    if (!err.isHandled) {
      toast.error(err.message)
    }
  }, [error])
}

export default useToastError
