import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'shared/store'
import { theme } from 'shared/theme/theme'
import App from './app'
import './index.css'
import reportWebVitals from './reportWebVitals'

/*if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./app/fixtures/browser')
  worker.start()
}*/

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

reportWebVitals()
