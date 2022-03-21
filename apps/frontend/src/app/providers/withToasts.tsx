import { Component, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { injectStyle } from 'react-toastify/dist/inject-style'

if (typeof window !== 'undefined') {
  injectStyle()
}

const withToasts = (component: () => Component) => () => {
  useEffect(() => {
    toast.info('🦄 Wow so easy!')
  }, [])

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
      {component()}
    </>
  )
}

export default withToasts
