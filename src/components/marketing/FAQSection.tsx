// ============================================
// NULISIN - FAQ SECTION COMPONENT
// ============================================

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Apakah Nulisin gratis?',
    answer: 'Ya, Nulisin sepenuhnya gratis untuk digunakan. Tidak ada biaya tersembunyi atau langganan.',
  },
  {
    question: 'Apakah tulisanku tersimpan di server?',
    answer: 'Tidak. Semua proses terjadi di browser kamu. Teks dan hasil generate tidak dikirim ke server mana pun. Draft hanya tersimpan secara lokal di perangkatmu.',
  },
  {
    question: 'Bisa upload font sendiri?',
    answer: 'Ya! Kamu bisa upload font custom dalam format .ttf, .otf, .woff, atau .woff2. Font akan tersimpan di browser dan bisa digunakan kapan saja.',
  },
  {
    question: 'Bisa pakai background kertas sendiri?',
    answer: 'Tentu! Kamu bisa upload gambar kertas custom dan mengatur area tulisan sesuai kebutuhan.',
  },
  {
    question: 'Hasilnya bisa di edit lagi?',
    answer: 'Hasil diunduh dalam format PNG, jadi tidak bisa diedit lagi. Tapi kamu bisa simpan draft dan generate ulang kapan saja.',
  },
  {
    question: 'Kenapa hasilnya beda tiap generate?',
    answer: 'Itu karena jitter effect yang membuat tulisan terlihat natural. Variasi kecil pada posisi dan rotasi karakter membuatnya mirip tulisan tangan asli.',
  },
  {
    question: 'Apakah bisa digunakan di mobile?',
    answer: 'Ya, Nulisin responsive dan bisa digunakan di smartphone, tablet, maupun desktop.',
  },
  {
    question: 'Font dan kertas custom hilang saat refresh?',
    answer: 'Tidak, font dan kertas custom tersimpan di browser (localStorage) dan akan tetap ada meski kamu refresh atau tutup browser.',
  },
];

export const FAQSection: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-white to-amber-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pertanyaan <span className="text-amber-600">Umum</span>
          </h2>
          <p className="text-lg text-gray-600">
            Ada yang mau ditanyain? Mungkin sudah terjawab di sini.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-xl border border-gray-100 px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
