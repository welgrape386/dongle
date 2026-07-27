import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Note: StrictMode is intentionally not used here. App.tsx's game logic
// (gameLogic.ts) is a direct port of imperative vanilla-JS code that
// attaches DOM event listeners once on mount; StrictMode's dev-only
// double-invoke of effects would attach every listener twice.
createRoot(document.getElementById('root')!).render(<App />)
