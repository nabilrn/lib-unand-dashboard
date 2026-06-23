# Context Prompt For Next Agent

Kamu sedang bekerja di repo `C:\Projects\lib-unand-dashboard-frontend`, aplikasi Vite React TypeScript untuk dashboard Perpustakaan Universitas Andalas.

Tujuan terbaru user:

- Audit seluruh implementasi frontend.
- Hapus semua kode yang memanggil API/backend karena user hanya ingin frontend.
- Siapkan data lokal yang bagus untuk UI.
- Jangan tampilkan teks/keterangan mode percobaan.
- Kurangi tampilan yang terasa AI-slop/generated.
- Prioritaskan neobrutalism yang rapi: border tebal, shadow kotak, warna solid, tanpa gradient/pulse/emoji dekoratif.
- Facility harus memakai foto Unsplash.
- Dashboard harus fit di browser landscape 100% scale, bukan hanya terlihat pas saat zoom 80%.
- Perbesar bagian statistik koleksi buku karena area itu terlalu kecil dibanding ruang kosong.
- Tambahkan localization untuk 4 bahasa: Indonesia, Inggris, Mandarin, Arab.
- Jangan sebar hardcoded copy pada komponen public dashboard; konten harus ditarik dari data/kamus.
- Setup GitHub Pages dengan GitHub Actions workflow, tanpa custom domain.
- Buat handoff prompt yang rapi untuk agent berikutnya.

Status saat ini:

- Aplikasi sudah frontend-only.
- Semua request data API sudah dihapus.
- Source dan build sudah bersih dari pemanggilan network data, host backend lama, provider cuaca eksternal, env API cuaca, prefix route backend, dan label demo/live API lama.
- Public dashboard sudah dipadatkan untuk landscape: root memakai `100dvh`, layout utama memakai CSS grid `minmax(0, 1fr)`, spacing/font memakai `clamp()`, dan komponen chart/event tidak lagi memakai tinggi fixed seperti `h-96` atau `h-[85%]`.
- Facility dan agenda memakai foto Unsplash dari `src/data/demoData.ts`; helper `src/lib/media.ts` hanya mengizinkan URL eksternal dari `images.unsplash.com`.
- Header menyembunyikan QR/kontak pada landscape sempit agar judul dan status utama tidak terpotong.
- Public fullscreen dashboard sudah memakai `LocaleProvider` dengan kamus di `src/i18n/locales.ts` untuk `id`, `en`, `zh`, dan `ar`. Locale disimpan di `localStorage` dan mengatur `html.lang`, `html.dir`, serta `document.title`.
- Data label public dashboard dibuat dari factory locale di `src/data/demoData.ts`: quote, cuaca, fasilitas, event, fakultas, judul buku, hari/bulan, KPI, dan chart rows.
- Chart config public dibuat melalui `getChartConfigs(locale)` di `src/components/visitor/config.ts`; export `chartConfigs` default Indonesia tetap ada untuk kompatibilitas area admin.
- Bagian `bookStats` di `src/components/VisitorChart.tsx` sudah diperbesar menjadi layout dua kolom dengan angka besar dan panel ringkasan koleksi.
- GitHub Pages sudah disiapkan di `.github/workflows/deploy-pages.yml`; Vite memakai base otomatis dari `GITHUB_REPOSITORY` saat `GITHUB_PAGES=true`.
- `src/lib/media.ts` sudah mem-prefix local asset dengan `import.meta.env.BASE_URL`, sehingga `/images/...` aman saat deploy ke subpath GitHub Pages.
- Build terakhir `pnpm build` berhasil.
- Simulasi build Pages dengan `GITHUB_PAGES=true` dan `GITHUB_REPOSITORY=nabil/lib-unand-dashboard-frontend` berhasil; output asset memakai `/lib-unand-dashboard-frontend/`.

File penting:

- `src/data/demoData.ts`: satu sumber data lokal untuk quote, cuaca, visitor count, ruangan, event, statistik chart, admin user, dan URL foto Unsplash.
- `src/i18n/locales.ts`: kamus locale public dashboard untuk Indonesia, Inggris, Mandarin, Arab.
- `src/i18n/LocaleContext.tsx`: provider, setter locale, helper `t(path, values)`, dan document language/title handling.
- `.github/workflows/deploy-pages.yml`: workflow deploy GitHub Pages dari artifact `build`, termasuk fallback SPA `404.html`.
- `public/images/demo/`: aset visual lokal lama masih ada, tetapi public dashboard saat ini memakai foto Unsplash untuk facility dan agenda.
- `src/components/visitor/data.ts`: loader chart lokal.
- `src/components/admin/events/localStore.ts`: store event lokal untuk admin CRUD.
- `FRONTEND_AUDIT.md`: ringkasan audit dan verifikasi.

Perilaku penting:

- Login admin bersifat lokal. User cukup memasukkan username dan password minimal 4 karakter; sesi disimpan di `localStorage`.
- Admin room/event/quote CRUD hanya mengubah state lokal browser.
- Header memakai quote dan cuaca lokal.
- Header memiliki switcher bahasa ringkas dan memakai locale untuk quote, tanggal, jam, cuaca, status, dan title.
- Visitor counter mensimulasikan perubahan angka lokal tanpa menyebut mode percobaan.
- Public chart/event/leaderboard/facility mengambil teks dari locale. Admin screens masih memakai copy Indonesia dan belum menjadi target localization penuh.
- Empty state tidak lagi mengambil Lottie JSON via fetch.
- Vite dev server tidak punya proxy API.

Batasan yang perlu dipertahankan:

- Jangan menambahkan API call, fungsi network browser, Axios, SSE, WebSocket, proxy backend, atau env API tanpa instruksi eksplisit dari user.
- Jangan menampilkan kata/label yang menyiratkan mode percobaan atau koneksi backend real-time.
- Jika butuh data baru untuk UI, tambahkan ke `src/data/demoData.ts`.
- Jika butuh teks/copy baru untuk public dashboard, tambahkan ke semua locale di `src/i18n/locales.ts` lalu akses lewat `useLocale().t(...)`.
- Untuk gambar public dashboard, boleh pakai foto Unsplash langsung dari `images.unsplash.com` bila sesuai brief visual. Jangan hotlink backend lama atau CDN lain.
- Jangan kembalikan gradient badge, emoji label, decorative pulse/bounce, ilustrasi SVG palsu untuk facility/agenda, atau tinggi fixed yang bisa memotong layout di 100% browser scale.
- Jangan menyentuh `.agents/`, `skills-lock.json`, atau `pnpm-lock.yaml` kecuali user meminta.

Verifikasi yang disarankan setelah perubahan:

- Jalankan grep untuk pola pemanggilan network data, host backend lama, provider cuaca eksternal, env API cuaca, prefix route backend, dan label mode percobaan/live API.
- Jalankan `pnpm build`.
- Untuk Pages, jalankan `cmd /c "set GITHUB_PAGES=true&&set GITHUB_REPOSITORY=nabil/lib-unand-dashboard-frontend&&pnpm build"` lalu cek `build/index.html` berisi `/lib-unand-dashboard-frontend/` pada CSS/JS/favicon.
- Untuk perubahan dashboard visual, tes landscape minimal `1536x864` dan `1366x768`. Pastikan `scrollHeight` dan `scrollWidth` sama dengan viewport, tanpa elemen keluar layar.
- Jalankan grep yang sama pada folder `build`.
