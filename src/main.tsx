import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const NO_STRICT_MODE = true;

createRoot(document.getElementById('root')!).render(
  NO_STRICT_MODE ? <App /> : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
)
