// ============================================
// NULISIN - MAIN APP COMPONENT
// ============================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from '@/components/marketing/HomePage';
import { GeneratorPage } from '@/components/generator/GeneratorPage';
import { loadDefaultFonts } from '@/lib/fonts/defaultFonts';
import './App.css';

function App() {
  // Load default fonts on app mount
  useEffect(() => {
    loadDefaultFonts().catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generator" element={<GeneratorPage />} />
        {/* Catch-all: redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
