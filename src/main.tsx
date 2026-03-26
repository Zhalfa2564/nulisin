// ============================================
// NULISIN - APP ENTRY POINT
// ============================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSentry } from '@/lib/sentry'
import { initAnalytics } from '@/lib/analytics'
import './index.css'
import App from './App.tsx'

// Initialize observability BEFORE React renders
initSentry();
initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
