import { Component } from 'react'
import { ToastContainer } from 'react-toastify'
import { injectStyle } from 'react-toastify/dist/inject-style'

if (typeof window !== 'undefined') {
  injectStyle()
}

const withToasts = (component: () => Component) => () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
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
