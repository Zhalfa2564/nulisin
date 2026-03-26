// ============================================
// NULISIN - HOMEPAGE COMPONENT
// ============================================

import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { UseCasesSection } from './UseCasesSection';
import { FAQSection } from './FAQSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { pageMeta } from '@/lib/seo/meta';

export const HomePage: React.FC = () => {
  useDocumentHead(pageMeta.home);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
