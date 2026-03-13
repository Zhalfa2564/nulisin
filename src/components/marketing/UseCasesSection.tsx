// ============================================
// NULISIN - USE CASES SECTION COMPONENT
// ============================================

import React from 'react';
import { FileText, Heart, GraduationCap, Briefcase, Gift, MessageSquare } from 'lucide-react';

const useCases = [
  {
    icon: FileText,
    title: 'Surat Pribadi',
    description: 'Buat surat pribadi yang terasa lebih hangat dan personal dengan tulisan tangan.',
  },
  {
    icon: Heart,
    title: 'Kartu Ucapan',
    description: 'Ucapan ulang tahun, anniversary, atau hari spesial lainnya jadi lebih berkesan.',
  },
  {
    icon: GraduationCap,
    title: 'Tugas Sekolah',
    description: 'Butuh tugas tulisan tangan? Generate dengan cepat tanpa repot menulis manual.',
  },
  {
    icon: Briefcase,
    title: 'Dokumen Kerja',
    description: 'Surat pengunduran diri, surat lamaran, atau dokumen lain yang membutuhkan tanda tangan.',
  },
  {
    icon: Gift,
    title: 'Hadiah Kreatif',
    description: 'Jadikan puisi atau quote favoritmu sebagai poster atau hadiah unik.',
  },
  {
    icon: MessageSquare,
    title: 'Catatan & Memo',
    description: 'Buat catatan atau memo yang terlihat lebih natural dan tidak kaku.',
  },
];

export const UseCasesSection: React.FC = () => {
  return (
    <section id="use-case" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Bisa Buat <span className="text-amber-600">Apa Aja</span>?
          </h2>
          <p className="text-lg text-gray-600">
            Nulisin bisa digunakan untuk berbagai keperluan, dari yang pribadi sampai profesional.
          </p>
        </div>

        {/* Use cases grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 transition-colors">
                  <useCase.icon className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {useCase.description}
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
