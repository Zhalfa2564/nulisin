# Nulisin - Generator Tulisan Tangan

Project ini adalah aplikasi "Single Page Application (SPA)" berbasis React + Vite yang menge-generate tulisan tangan menjadi file gambar.

## Panduan Deploy ke Static Hosting

Karena Nulisin menggunakan sistem **Client-Side Routing** (Browser Router), Anda membutuhkan aturan "Rewrite" khusus agar server penerima tidak me-lempar halaman 404 (Not Found) saat pengunjung me-refresh rute sekunder seperti `/generator`.

Pusat root file SPA ini diarahkan ke `/index.html`.

### 1. Vercel
Kami telah menyertakan sekumpulan instruksi *redirect* di dalam file konfigurasi spesifik Vercel.
- File config: `vercel.json` (Aman disimpan di Repository)
- Cara Deploy:
  1. Login ke Vercel via Github
  2. Import repository project ini
  3. Framework Preset biarkan otomatis terdeteksi "Vite"
  4. Klik Deploy.
  Vercel akan otomatis membaca file `vercel.json` untuk fallback URL `/generator` ke `/index.html`.

### 2. Firebase Hosting
Jika mempublikasikan ke infrastruktur GCP/Firebase:
- File config: `firebase.json` (Aman disimpan di Repository, folder publik menunjuk `dist`)
- Cara Deploy:
  1. Jalankan `npm run build` untuk memproduksi direktori lokal `/dist`.
  2. Install firebase CLI secara global `npm install -g firebase-tools`
  3. Ketik `firebase login` untuk mengotentikasi akun.
  4. Ketik `firebase init hosting` dan arahkan direktori publik ke `dist`. (Saat ditanya 'Configure as a single-page app? (Y/N)' Jawab Y, meskipun `firebase.json` kami sudah mem-bypass aturan ini secara otomatis.)
  5. Kirim file dengan perintah: `firebase deploy --only hosting`
