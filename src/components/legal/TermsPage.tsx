// ============================================
// NULISIN - TERMS OF USE PAGE
// ============================================

import React, { useEffect } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { pageMeta } from '@/lib/seo/meta';

export const TermsPage: React.FC = () => {
  useDocumentHead(pageMeta.terms);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="prose prose-amber max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Ketentuan Penggunaan
          </h1>
          
          <p className="text-gray-600 mb-8 pb-8 border-b">
            Terakhir diperbarui: {new Date('2026-03-26').toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Penggunaan Layanan Secara Wajar</h2>
              <p>
                Nulisin adalah aplikasi bantu visual berbentuk generator tulisan tangan. Layanan ini dirancang khusus untuk keperluan wajar seperti <strong>hiburan, artistik, desain, personal, profil, maupun edukatif</strong>.
              </p>
              <p className="mt-2">
                Meskipun kami membangun Nulisin sebaik mungkin, seluruh fungsionalitas dan output web ini disediakan atas dasar <strong>"sebagaimana adanya" (as is)</strong> dan <strong>"sebagaimana tersedia" (as available)</strong>. Kami tidak menjamin ketersediaan mutlak tanpa interupsi atau kesalahan.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Tanggung Jawab Pengguna dan Hak Cipta File Akses Lokal</h2>
              <p>
                Di fitur generator kustom, Nulisin memberikan Anda kebebasan untuk mengunggah jenis huruf kustom (font) dan lapisan kertas (images/papers). Dengan menggunakan fitur ini, Anda <strong>diwajibkan dan menjamin untuk memastikan secara penuh bahwa file tersebut legal</strong>:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Anda berhak, memiliki otorisasi, dan memegang lisensi komersial (komersil) atau legal yang sesuai.</li>
                <li>Materi tersebut tidak merugikan klaim Hak Atas Kekayaan Intelektual (HAKI) / Copyright dari pihak ketiga.</li>
              </ul>
              <p className="mt-2">
                <strong>Nulisin dibebaskan seutuhnya dari seluruh potensi dan/atau masalah penuntutan lisensi.</strong> File-file tersebut hanya diproses lokal di peramban (browser) Anda tanpa masuk ke server kami, maka kelayakan pakai bersifat wewenang Anda semata.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Larangan Penggunaan</h2>
              <p>
                 Anda dengan tegas tidak diperkenankan untuk menyalahgunakan fungsionalitas Nulisin:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Melakukan percobaan hacking dengan file berbahaya secara sengaja ke alat parser kami.</li>
                <li>Melakukan pemalsuan administratif seperti memalsukan tanda tangan digital, stempel, wesel/cek, atau dokumen kenegaraan bersertifikat.</li>
                <li>Mempergunakan hasil generatif (outputs) program ini untuk penipuan, mengelabui penegak hukum, maupun tindakan kriminal yang melanggar hukum negara yurisdiksi Anda atau Republik Indonesia.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Perubahan Fitur</h2>
              <p>
                Sebagai layanan yang berjalan secara berkelanjutan, kami berhak menambah, mengurangi, merombak atau menghapus fitur apa pun dalam Nulisin sewaktu-waktu tanpa pemberitahuan sebelumnya, demi kepentingan performa teknis, kepatuhan legal, atau inovasi.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
