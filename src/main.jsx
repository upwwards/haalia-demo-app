import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { applyThemeAttribute } from './themes/themes.js'
import './themes/theme-1.css'
import './themes/theme-4.css'
import './themes/theme-5.css'
import './themes/theme-6.css'
import './themes/theme-7.css'
import './themes/theme-crystal.css'
import './styles/base.css'

applyThemeAttribute()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
