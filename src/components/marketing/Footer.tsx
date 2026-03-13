// ============================================
// NULISIN - FOOTER COMPONENT
// ============================================

import React from 'react';
import { Pen, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Generator', href: '/generator' },
      { label: 'Fitur', href: '#fitur' },
      { label: 'Cara Kerja', href: '#cara-kerja' },
    ],
    resources: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Use Case', href: '#use-case' },
    ],
    legal: [
      { label: 'Privasi', href: '#' },
      { label: 'Syarat', href: '#' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <Pen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-lg">Nulisin</span>
            </a>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Generator tulisan tangan digital yang membantu kamu mengubah teks biasa menjadi hasil yang terlihat natural.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} Nulisin. Dibuat dengan <Heart className="w-3 h-3 inline text-red-500" /> di Indonesia.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produk</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Nulisin adalah generator tulisan tangan digital. Hasil generated hanya untuk penggunaan personal dan edukasi.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
