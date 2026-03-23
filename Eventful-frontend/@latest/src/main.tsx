// import { StrictMode } from 'react'
import { CookiesProvider } from 'react-cookie';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
)
