import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

const baseUrl = import.meta.env.BASE_URL
const checkoutRoute = new URLSearchParams(window.location.search).get('route')

if (checkoutRoute) {
  window.history.replaceState(null, '', `${baseUrl}${checkoutRoute.replace(/^\/+/, '')}${window.location.hash}`)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={baseUrl}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
