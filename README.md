# Dashboard Perpustakaan Universitas Andalas

Dashboard informasi fullscreen untuk Perpustakaan Universitas Andalas. Project ini dibuat sebagai aplikasi frontend-only untuk layar landscape seperti monitor lobby, laptop, atau display informasi perpustakaan.

## Deskripsi Singkat

Aplikasi ini menampilkan ringkasan layanan perpustakaan, jumlah pengunjung hari ini, fasilitas ruangan, agenda kegiatan, statistik kunjungan, peminjaman buku, peminjam aktif, dan ikhtisar koleksi. Semua data berasal dari data lokal yang disiapkan untuk kebutuhan presentasi UI, tanpa koneksi API/backend.

## Fitur

- Dashboard public fullscreen dengan desain neobrutalism rapi.
- Landscape-only guard: layar portrait menampilkan pesan `Landscape screen only`.
- Data lokal untuk quote, cuaca, visitor counter, fasilitas, agenda, chart, leaderboard, dan statistik koleksi.
- Localization 4 bahasa: Indonesia, English, Mandarin, Arabic.
- Foto fasilitas dan agenda menggunakan Unsplash.
- Admin lokal untuk manajemen konten browser-side.
- Siap deploy ke GitHub Pages tanpa custom domain.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Recharts
- Motion
- Lucide React
- pnpm

## Struktur Penting

- `src/data/demoData.ts`: sumber data lokal untuk dashboard.
- `src/i18n/locales.ts`: kamus 4 bahasa.
- `src/i18n/LocaleContext.tsx`: provider localization dan helper `t(...)`.
- `src/components/VisitorChart.tsx`: chart utama dan statistik koleksi.
- `src/components/Header.tsx`: header, status layanan, cuaca, waktu, dan language switcher.
- `.github/workflows/deploy-pages.yml`: workflow deploy GitHub Pages.
- `AGENT_CONTEXT_PROMPT.md`: handoff context untuk agent berikutnya.

## Menjalankan Lokal

Install dependencies:

```bash
pnpm install
```

Jalankan development server:

```bash
pnpm dev
```

Build production:

```bash
pnpm build
```

Preview build:

```bash
pnpm preview
```

## Deploy GitHub Pages

Workflow GitHub Pages sudah tersedia di `.github/workflows/deploy-pages.yml`.

Deploy berjalan otomatis saat push ke branch `main`, atau bisa dijalankan manual dari tab Actions dengan `workflow_dispatch`.

Konfigurasi Vite akan memakai base path otomatis dari `GITHUB_REPOSITORY` saat environment `GITHUB_PAGES=true`, sehingga asset tetap valid untuk URL GitHub Pages berbasis repository.

## Catatan Pengembangan

- Jangan menambahkan API call, proxy backend, SSE, WebSocket, atau env API tanpa instruksi eksplisit.
- Konten public dashboard sebaiknya ditambahkan melalui `src/data/demoData.ts` dan `src/i18n/locales.ts`.
- Untuk teks public dashboard, gunakan `useLocale().t(...)` agar tetap mendukung 4 bahasa.
- Dashboard public ditargetkan untuk landscape. Mobile portrait sengaja diblokir.
