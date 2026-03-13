// ============================================
// NULISIN - FEATURES SECTION COMPONENT
// ============================================

import React from 'react';
import { Zap, Palette, Download, Sparkles, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Hasil Natural',
    description: 'Tulisan tangan yang terlihat autentik dengan variasi karakter dan jitter natural.',
  },
  {
    icon: Palette,
    title: 'Font & Kertas Fleksibel',
    description: 'Pilih dari berbagai font handwriting dan template kertas yang bisa dikustomisasi.',
  },
  {
    icon: Download,
    title: 'Export PNG HD',
    description: 'Unduh hasil dalam format PNG berkualitas tinggi, siap digunakan.',
  },
  {
    icon: Zap,
    title: 'Live Preview',
    description: 'Lihat hasil secara real-time saat kamu mengetik dan mengubah pengaturan.',
  },
  {
    icon: Shield,
    title: 'Privasi Terjaga',
    description: 'Semua proses di browser. Teks kamu tidak dikirim ke server mana pun.',
  },
  {
    icon: Clock,
    title: 'Autosave Draft',
    description: 'Draft tersimpan otomatis di browser, jadi tidak perlu khawatir kehilangan.',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="fitur" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Kenapa Pakai <span className="text-amber-600">Nulisin</span>?
          </h2>
          <p className="text-lg text-gray-600">
            Generator tulisan tangan yang dirancang untuk hasil terbaik dengan pengalaman pengguna yang menyenangkan.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-amber-50 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
