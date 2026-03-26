// ============================================
// NULISIN - MAIN APP COMPONENT
// ============================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/components/marketing/HomePage';
import { GeneratorPage } from '@/components/generator/GeneratorPage';
import { PrivacyPage } from '@/components/legal/PrivacyPage';
import { TermsPage } from '@/components/legal/TermsPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { loadDefaultFonts } from '@/lib/fonts/defaultFonts';
import { trackPageView } from '@/lib/analytics';
import './App.css';

// Track SPA page views on route change
function AnalyticsPageTracker() {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Nulisin — Generator Tulisan Tangan Digital',
      '/generator': 'Generator Nulisin',
      '/privacy': 'Kebijakan Privasi — Nulisin',
      '/terms': 'Ketentuan Penggunaan — Nulisin',
    };
    trackPageView(location.pathname, titles[location.pathname] || 'Nulisin');
  }, [location.pathname]);

  return null;
}

function App() {
  // Load default fonts on app mount
  useEffect(() => {
    loadDefaultFonts().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <AnalyticsPageTracker />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generator" element={<GeneratorPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Catch-all: redirect unknown routes to homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
