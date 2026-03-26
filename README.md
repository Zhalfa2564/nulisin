# Nulisin — Generator Tulisan Tangan Digital

Nulisin adalah aplikasi web berbasis *Single Page Application* (SPA) yang membantu pengguna mengubah teks biasa menjadi tulisan tangan digital yang terlihat natural secara langsung di peramban (browser). Aplikasi ini dibangun dengan prinsip *local-first*, memproses semua data dan font di perangkat pengguna tanpa mengunggahnya ke server.

Dibuat dengan: **Vite + React + TypeScript + Tailwind CSS**

---

## Prasyarat Lingkungan (Environment)

Aplikasi ini dapat berjalan sempurna **tanpa konfigurasi tambahan**. Namun, jika ingin mengaktifkan layanan monitoring (opsional di production), Anda dapat menyalin `.env.example` menjadi `.env.local` dan mengisi:

- `VITE_GA_MEASUREMENT_ID` (Opsional) - ID Google Analytics 4 (mis. `G-XXXXXXXXXX`).
- `VITE_SENTRY_DSN` (Opsional) - DSN Sentry untuk pemantauan eror.
- `VITE_APP_VERSION` (Opsional) - Penanda versi aplikasi (mis. `1.0.0`).

Catatan Privasi: Jika diaktifkan, konfigurasi Sentry dan Analytics telah di-set dengan *masking* ketat. Teks dan ketikan pengguna **tidak akan pernah dikirimkan**.

---

## Pengembangan Lokal (Local Development)

Pastikan Node.js terinstal (direkomendasikan versi 18+).

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev
```

Buka `http://localhost:5173` di peramban.

---

## Build Production

```bash
# Lakukan kompilasi TypeScript dan build statis
npm run build
```

Hasil kompilasi akan berada di dalam direktori `dist/`. Folder ini adalah arsip statis yang bisa Anda unggah ke layanan hosting mana pun.

---

## Panduan Deployment

Karena Nulisin adalah SPA, server statis harus diatur untuk melempar *(rewrite)* semua rute yang tidak ditemukan kembali ke `index.html`. Konfigurasi untuk Vercel dan Firebase Hosting sudah disertakan di repositori ini.

### Deploy ke Vercel (Rekomendasi)
Paling mudah, Anda bisa menghubungkan repositori GitHub langsung ke Vercel. Vercel akan secara otomatis membaca pengaturan di `vercel.json`.
Atau melalui CLI:
```bash
npm i -g vercel
vercel
```

### Deploy ke Firebase Hosting
Aplikasi sudah menyediakan `firebase.json` yang dikonfigurasi dengan *cache headers* optimal.
```bash
npm i -g firebase-tools
firebase login
firebase init hosting # Pilih direktori "dist" dan jangan override file firebase.json
npm run build
firebase deploy
```

---

## Checklist Launch Final (V1)

Gunakan checklist ini setiap kali Anda akan merilis versi baru ke Production:

### 1. Build & Linting
- [ ] `npm run lint` berjalan tanpa eror.
- [ ] `npm run build` berjalan mulus dan folder `dist/` terbentuk.

### 2. Core Features Test (di Environment Production)
- [ ] Homepage *(Hero, FAQ, dll)* tampil dengan benar.
- [ ] Rute `/generator` menampilkan UI generator dengan rapi.
- [ ] Input (Nama, Tanggal, Isi) langsung sinkron di kanvas.
- [ ] Unduh PNG menghasilkan gambar yang jelas tanpa teks terpotong.
- [ ] Upload Font Eksternal (`.ttf/.otf`) ter-render dengan benar.
- [ ] Upload Paper Eksternal (Gambar template) merespons area teks (*zones*).
- [ ] Tombol Reset mengembalikan *state* menjadi default bawaan aplikasi.
- [ ] *Overflow warning* (Peringatan garis merah) muncul saat baris teks melebihi kertas.
- [ ] *Autosave* draft bekerja bila berpindah halaman lalu kembali lagi.

### 3. SPA & Routing Safety
- [ ] Melakukan *refresh* (F5) persis di path `/generator` tidak memunculkan eror `404 Not Found`.

### 4. Trust & Legal
- [ ] Tautan Kebijakan Privasi (`/privacy`) dapat dibuka.
- [ ] Tautan Ketentuan Penggunaan (`/terms`) dapat dibuka.
- [ ] Footer memuat tautan yang benar di Homepage maupun Generator.

### 5. SEO & Meta
- [ ] `robots.txt` dan `sitemap.xml` bisa diakses (misal `/robots.txt`).
- [ ] Tag `title` dan `description` berubah sesuai dengan halaman yang sedang dibuka.
- [ ] Tag OG Image dan Favicon termuat (Cek melalui layanan seperti *HeyMeta* atau *OpenGraph.xyz*).

---

Terima kasih karena telah menggunakan dan ikut mengembangkan Nulisin!
