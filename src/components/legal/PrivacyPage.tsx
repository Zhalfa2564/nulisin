// ============================================
// NULISIN - PRIVACY POLICY PAGE
// ============================================

import React, { useEffect } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { pageMeta } from '@/lib/seo/meta';

export const PrivacyPage: React.FC = () => {
  useDocumentHead(pageMeta.privacy);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="prose prose-amber max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Kebijakan Privasi
          </h1>
          
          <p className="text-gray-600 mb-8 pb-8 border-b">
            Terakhir diperbarui: {new Date('2026-03-26').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Komitmen Kami pada Privasi</h2>
              <p>
                Di Nulisin, kami percaya bahwa privasi adalah hak Anda. Karena itu, kami merancang aplikasi ini dengan prinsip <strong>Privacy by Design</strong>. Semua proses penulisan tulisan tangan digital terjadi secara lokal di peramban (browser) Anda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Data yang Disimpan Secara Lokal</h2>
              <p>
                Aplikasi kami menyimpan beberapa data agar Anda bisa melanjutkan pekerjaan kapan saja. Data berikut ini disimpan <strong>sepenuhnya di memori lokal peramban Anda (localStorage)</strong> dan tidak pernah diunggah ke server kami:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Draft tulisan:</strong> Isi teks teks, nama, tanggal, serta pengaturan font dan kertas terakhir yang Anda gunakan.</li>
                <li><strong>Font kustom:</strong> File font (.ttf, .otf, dll) yang Anda unggah.</li>
                <li><strong>Kertas kustom:</strong> Template dan pengaturan zona gambar yang Anda buat.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data yang Tidak Kami Kumpulkan</h2>
              <p>
                Kami <strong>sama sekali tidak membaca, menyimpan, atau mengirimkan</strong> isi teks tulisan tangan, nama, maupun tanggal yang Anda ketikkan ke server mana pun (termasuk untuk analytics). Anda memegang kendali penuh atas karya Anda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Analitik dan Pemantauan Layanan</h2>
              <p>
                Untuk membantu kami meningkatkan layanan dan mengetahui terjadinya masalah (error), kami menggunakan layanan analitik anonim pihak ketiga (Google Analytics) serta sistem deteksi eror teknis (Sentry).
              </p>
              <p className="mt-2">
                Data yang dikumpulkan hanya bersifat metadata teknis, seperti: waktu kunjungan, jenis perangkat, rute halaman, dan rekam jejak eror program (crash logs). Sistem peringatan dini kami telah kami rancang dengan protokol ketat (masking) agar tidak merekam konten teks sensitif jika terjadi eror.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Perubahan Kebijakan</h2>
              <p>
                Seiring dengan bertambahnya fitur, kebijakan ini mungkin perlu diperbarui di masa mendatang. Penggunaan berkelanjutan Anda atas layanan ini menandakan pemahaman dan persetujuan Anda mengenai cara kami menangani privasi as-is saat ini.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
