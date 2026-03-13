// ============================================
// NULISIN - SEO CONFIGURATION
// ============================================

import type { SEOMeta } from '@/types';

export const siteConfig = {
  name: 'Nulisin',
  tagline: 'Generator Tulisan Tangan',
  description: 'Ubah teks biasa jadi tulisan tangan digital yang natural, rapi, dan siap diunduh dalam hitungan detik.',
  url: 'https://nulisin.app',
  ogImage: '/og-image.png',
  twitter: '@nulisin',
  keywords: [
    'generator tulisan tangan',
    'tulisan tangan digital',
    'tulisan tangan online',
    'buat tulisan tangan online',
    'generator handwriting',
    'tulisan tangan indonesia',
    'font tulisan tangan',
    'kertas tulisan tangan digital',
  ],
};

export const generateMetaTags = (meta?: Partial<SEOMeta>) => {
  const title = meta?.title || `${siteConfig.name} - ${siteConfig.tagline}`;
  const description = meta?.description || siteConfig.description;
  const keywords = meta?.keywords || siteConfig.keywords;
  const ogImage = meta?.ogImage || `${siteConfig.url}${siteConfig.ogImage}`;
  const canonicalUrl = meta?.canonicalUrl || siteConfig.url;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    'og:title': title,
    'og:description': description,
    'og:image': ogImage,
    'og:url': canonicalUrl,
    'og:type': 'website',
    'og:site_name': siteConfig.name,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': ogImage,
    'twitter:site': siteConfig.twitter,
    canonical: canonicalUrl,
  };
};

export const pageMeta = {
  home: generateMetaTags({
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    canonicalUrl: siteConfig.url,
  }),
  generator: generateMetaTags({
    title: `Generator - ${siteConfig.name}`,
    description: 'Buat tulisan tangan digital kamu sendiri. Pilih font, pilih kertas, ketik, dan unduh hasilnya.',
    canonicalUrl: `${siteConfig.url}/generator`,
  }),
};

// Generate JSON-LD structured data
export const generateStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    inLanguage: 'id',
    audience: {
      '@type': 'Audience',
      audienceType: 'General',
    },
  };
};

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};
