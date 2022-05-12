import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { injectStyle } from 'react-toastify/dist/inject-style'

if (typeof window !== 'undefined') {
  injectStyle()
}

const Toasts: React.FC = () => {
  useEffect(() => {
    toast.info('🦄 Wow so easy!')
  }, [])

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
    />
  )
}

export default Toasts
