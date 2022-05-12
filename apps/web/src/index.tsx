import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'shared/store'
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
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

reportWebVitals()
