// ============================================
// NULISIN - CTA SECTION COMPONENT
// ============================================

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTASection: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-orange-600" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Gratis, Tanpa Daftar
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Siap Buat Tulisan Tangan Digitalmu?
        </h2>

        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Langsung coba aja, gak perlu ribet. Ketik, pilih gaya, unduh. Selesai.
        </p>

        <Link to="/generator">
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-gray-100 px-10 h-14 text-lg font-semibold group shadow-xl shadow-black/10"
          >
            Mulai Sekarang
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <p className="text-white/70 text-sm mt-6">
          100% gratis • Tanpa watermark • Tanpa daftar
        </p>
      </div>
    </section>
  );
};
