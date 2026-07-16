import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './themes/theme-1.css'
import './themes/theme-2.css'
import './themes/theme-3.css'
import './themes/theme-4.css'
import './themes/theme-5.css'
import './themes/theme-6.css'
import './themes/theme-7.css'
import './styles/base.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
