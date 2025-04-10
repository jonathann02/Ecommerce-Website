import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import { CartProvider } from './contexts/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
    <CartProvider>
      <App />
    </CartProvider>
    </HashRouter>
  </StrictMode>,
)

// BrowserRouter