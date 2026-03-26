// ============================================
// NULISIN - SEO CONFIGURATION
// ============================================

const BASE_URL = (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/+$/, '') || 'https://nulisin.app';

export const siteConfig = {
  name: 'Nulisin',
  tagline: 'Generator Tulisan Tangan',
  url: BASE_URL,
  ogImage: `${BASE_URL}/og-image.png`,
  themeColor: '#d97706',
  locale: 'id_ID',
  language: 'id',
};

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
}

export const pageMeta: Record<string, PageMeta> = {
  home: {
    title: 'Nulisin — Generator Tulisan Tangan Digital',
    description:
      'Nulisin membantu kamu mengubah teks biasa menjadi tulisan tangan digital yang natural, rapi, dan siap diunduh langsung dari browser.',
    canonical: BASE_URL,
    ogTitle: 'Nulisin — Generator Tulisan Tangan Digital',
    ogDescription: 'Ketik aja, biar kelihatan kayak nulis.',
    ogType: 'website',
  },
  generator: {
    title: 'Generator Nulisin — Bikin Ketikan Terasa Seperti Tulisan Tangan',
    description:
      'Ketik isi tulisanmu, pilih font dan kertas, lalu unduh hasil tulisan tangan digital yang terlihat natural dengan Nulisin.',
    canonical: `${BASE_URL}/generator`,
    ogTitle: 'Generator Nulisin',
    ogDescription: 'Bikin ketikan terasa seperti tulisan tangan.',
    ogType: 'website',
  },
  privacy: {
    title: 'Kebijakan Privasi — Nulisin',
    description: 'Pelajari bagaimana Nulisin memproses tulisan tangan digital Anda secara lokal untuk menjaga privasi.',
    canonical: `${BASE_URL}/privacy`,
    ogTitle: 'Kebijakan Privasi Nulisin',
    ogDescription: 'Pelajari bagaimana kami melindungi data Anda dengan pemrosesan lokal.',
    ogType: 'website',
  },
  terms: {
    title: 'Ketentuan Penggunaan — Nulisin',
    description: 'Syarat dan ketentuan penggunaan Nulisin Generator Tulisan Tangan Digital.',
    canonical: `${BASE_URL}/terms`,
    ogTitle: 'Ketentuan Penggunaan Nulisin',
    ogDescription: 'Syarat dan ketentuan penggunaan layanan generator.',
    ogType: 'website',
  },
};

// FAQ data shared between the component and JSON-LD
export const faqData = [
  {
    question: 'Apakah Nulisin gratis?',
    answer:
      'Ya, Nulisin sepenuhnya gratis untuk digunakan. Tidak ada biaya tersembunyi atau langganan.',
  },
  {
    question: 'Apakah tulisanku tersimpan di server?',
    answer:
      'Tidak. Semua proses terjadi di browser kamu. Teks dan hasil generate tidak dikirim ke server mana pun. Draft hanya tersimpan secara lokal di perangkatmu.',
  },
  {
    question: 'Bisa upload font sendiri?',
    answer:
      'Ya! Kamu bisa upload font custom dalam format .ttf, .otf, .woff, atau .woff2. Font akan tersimpan di browser dan bisa digunakan kapan saja.',
  },
  {
    question: 'Bisa pakai background kertas sendiri?',
    answer:
      'Tentu! Kamu bisa upload gambar kertas custom dan mengatur area tulisan sesuai kebutuhan.',
  },
  {
    question: 'Hasilnya bisa diedit lagi?',
    answer:
      'Hasil diunduh dalam format PNG, jadi tidak bisa diedit lagi. Tapi kamu bisa simpan draft dan generate ulang kapan saja.',
  },
  {
    question: 'Kenapa hasilnya beda tiap generate?',
    answer:
      'Itu karena jitter effect yang membuat tulisan terlihat natural. Variasi kecil pada posisi dan rotasi karakter membuatnya mirip tulisan tangan asli.',
  },
  {
    question: 'Apakah bisa digunakan di mobile?',
    answer:
      'Ya, Nulisin responsive dan bisa digunakan di smartphone, tablet, maupun desktop.',
  },
  {
    question: 'Font dan kertas custom hilang saat refresh?',
    answer:
      'Tidak, font dan kertas custom tersimpan di browser (localStorage) dan akan tetap ada meski kamu refresh atau tutup browser.',
  },
];
