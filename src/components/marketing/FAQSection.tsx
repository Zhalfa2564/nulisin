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
import { faqData } from '@/lib/seo/meta';

const faqs = faqData;

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
