import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ShopProvider } from './context/ShopContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ShopProvider>
        <App />
      </ShopProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
