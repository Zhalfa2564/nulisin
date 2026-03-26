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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Privasi Kamu, Prioritas Kami</h2>
              <p>
                Nulisin dirancang dengan prinsip <strong>local-first</strong>. Artinya, semua proses — dari mengetik, memilih font, sampai menghasilkan gambar — terjadi langsung di browser kamu. Tidak ada yang dikirim ke server kami.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Data yang Tersimpan di Browser Kamu</h2>
              <p>
                Agar kamu bisa melanjutkan pekerjaan kapan saja, beberapa data disimpan di <strong>localStorage browser</strong> kamu — bukan di server kami:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li><strong>Draft tulisan:</strong> Nama, tanggal, isi teks, serta pilihan font dan kertas terakhir.</li>
                <li><strong>Font kustom:</strong> File font (.ttf, .otf, dll) yang kamu unggah.</li>
                <li><strong>Kertas kustom:</strong> Gambar template dan pengaturan area tulisan yang kamu buat.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data yang Tidak Kami Kumpulkan</h2>
              <p>
                Kami <strong>tidak membaca, menyimpan, atau mengirim</strong> isi tulisan, nama, maupun tanggal yang kamu ketik. Bahkan sistem analytics kami pun tidak merekam konten tulisanmu. Data kamu sepenuhnya milik kamu.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Analytics & Pemantauan Error</h2>
              <p>
                Kami menggunakan Google Analytics dan Sentry untuk memahami fitur mana yang paling sering dipakai dan mendeteksi error teknis. Data yang dikumpulkan hanya bersifat anonim: halaman yang dikunjungi, jenis perangkat, dan jejak error program.
              </p>
              <p className="mt-2">
                Tidak ada isi tulisan, nama file, atau konten personal yang masuk ke dalam data analytics maupun laporan error.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Perubahan Kebijakan</h2>
              <p>
                Kebijakan ini bisa berubah seiring berkembangnya fitur Nulisin. Dengan terus menggunakan layanan ini, kamu menyetujui kebijakan privasi yang berlaku saat itu.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
