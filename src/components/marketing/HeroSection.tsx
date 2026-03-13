// ============================================
// NULISIN - HERO SECTION COMPONENT
// ============================================

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-100/50 to-transparent rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Nulisin — Generator Tulisan Tangan
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Ketik aja,{' '}
              <span className="text-amber-600 relative">
                biar kelihatan
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              kayak nulis.
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Ubah teks biasa jadi tulisan tangan digital yang natural, rapi, dan siap diunduh dalam hitungan detik. 
              Gratis, tanpa watermark, langsung jadi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="/generator">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-12 text-base group"
                >
                  Coba Sekarang
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#preview">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 h-12 text-base border-gray-300 hover:bg-gray-50"
                >
                  Lihat Contoh Hasil
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-gray-200">
              <div>
                <p className="text-2xl font-bold text-gray-900">6+</p>
                <p className="text-sm text-gray-500">Font Handwriting</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">6+</p>
                <p className="text-sm text-gray-500">Template Kertas</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-gray-500">Gratis</p>
              </div>
            </div>
          </div>

          {/* Right content - Preview card */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Paper background simulation */}
              <div className="bg-[#fef9e7] rounded-lg p-6 relative overflow-hidden">
                {/* Lines */}
                <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300/50" />
                <div className="space-y-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border-b border-blue-300/30 h-6" />
                  ))}
                </div>

                {/* Handwriting text overlay */}
                <div className="absolute inset-0 p-8 pl-16">
                  <p className="font-['Caveat'] text-2xl text-gray-700 leading-relaxed opacity-90">
                    Halo Budi,
                  </p>
                  <p className="font-['Caveat'] text-xl text-gray-600 leading-relaxed mt-4 opacity-80">
                    13 Maret 2026
                  </p>
                  <p className="font-['Caveat'] text-xl text-gray-700 leading-relaxed mt-6 opacity-90">
                    Terima kasih sudah membantu kemarin.
                    Aku sangat menghargai waktumu.
                    Semoga kita bisa bertemu lagi!
                  </p>
                  <p className="font-['Caveat'] text-xl text-gray-700 leading-relaxed mt-6 opacity-90">
                    Salam,
                    <br />
                    Andi
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Hasil Real-time
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-amber-200 rounded-full opacity-50 blur-xl" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};
