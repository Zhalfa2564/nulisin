// ============================================
// NULISIN - HOW IT WORKS SECTION COMPONENT
// ============================================

import React from 'react';
import { Type, Palette, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Type,
    title: 'Ketik Tulisanmu',
    description: 'Masukkan nama, tanggal, dan isi tulisan yang ingin kamu ubah jadi tulisan tangan.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Pilih Gaya',
    description: 'Pilih font handwriting dan template kertas yang sesuai dengan kebutuhanmu.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Unduh Hasilnya',
    description: 'Preview secara real-time, lalu unduh hasilnya dalam format PNG berkualitas tinggi.',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="cara-kerja" className="py-24 bg-gradient-to-b from-white to-amber-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja <span className="text-amber-600">Simpel</span>
          </h2>
          <p className="text-lg text-gray-600">
            Cuma 3 langkah, tulisan tangan digitalmu siap digunakan.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-200 to-transparent" />
              )}

              <div className="relative">
                {/* Step number */}
                <span className="absolute -top-4 -left-2 text-6xl font-bold text-amber-100 select-none">
                  {step.number}
                </span>

                {/* Content */}
                <div className="relative pt-8">
                  <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-amber-600/20">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
