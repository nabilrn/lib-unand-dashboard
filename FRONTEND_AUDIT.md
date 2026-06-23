# Frontend Audit

Tanggal audit: 2026-06-22

## Status Akhir

Frontend sudah dibuat menjadi aplikasi frontend-only. Tidak ada pemanggilan network data, endpoint backend, integrasi cuaca eksternal, proxy backend, atau teks mode percobaan di source maupun bundle build.

Audit desain terbaru juga sudah merapikan public dashboard ke arah neobrutalism yang lebih disiplin. Komponen utama tidak lagi bergantung pada zoom browser 80%; layout sudah diuji fit pada viewport landscape 1536x864 dan 1366x768 di 100% scale tanpa overflow.

## Area Yang Diaudit

- Public dashboard: header, visitor counter, fasilitas ruangan, agenda, chart carousel, leaderboard, empty state.
- Admin: login, route guard, dashboard, room management, event management, quote management, file admin lama yang tidak aktif.
- Infrastruktur frontend: Vite dev server, env example, Nginx example.
- Dokumen lama terkait backend/CORS.

## Perubahan Utama

- Menambahkan dataset lokal terpusat di `src/data/demoData.ts`.
- Menambahkan aset visual lokal di `public/images/demo/`.
- Menghapus modul request data lama untuk visitor dan event admin.
- Mengganti dengan adaptor lokal:
  - `src/components/visitor/data.ts`
  - `src/components/admin/events/localStore.ts`
- Login admin sekarang membuat sesi lokal berbasis `localStorage`.
- CRUD ruangan, event, dan quote berjalan di state lokal browser.
- Header memakai quote dan cuaca lokal, bukan OpenWeather/backend.
- Visitor counter dan chart memakai data lokal yang stabil.
- Public dashboard memakai grid viewport `100dvh`, `minmax(0, 1fr)`, dan `clamp()` untuk padding/font agar panel tidak berhimpitan atau terpotong.
- Menghapus pola visual yang terasa generated di public dashboard: gradient badge, emoji label, pulse/bounce dekoratif, dan ilustrasi event yang ter-crop.
- Facility dan agenda memakai foto Unsplash melalui `src/data/demoData.ts`.
- `src/lib/media.ts` tetap lokal-first, dengan allowlist eksternal hanya untuk `images.unsplash.com`.
- Menghapus dokumen backend lama `api admin.txt` dan `CORS_SOLUTION.md`.
- Menghapus proxy API dari `vite.config.ts`.

## Verifikasi

- `pnpm build` berhasil.
- Audit grep source dan build tidak menemukan pemanggilan network data, host backend lama, provider cuaca eksternal, env API cuaca, prefix route backend, atau label UI yang menyiratkan mode percobaan/live API.
- Browser verification:
  - `1536x864`: `scrollWidth`/`scrollHeight` sama dengan viewport, overflow count 0.
  - `1366x768`: `scrollWidth`/`scrollHeight` sama dengan viewport, overflow count 0.

## Catatan

`build.zip`, `node_modules`, dan untracked skill files tidak disentuh. Tautan eksternal biasa seperti Instagram, website perpustakaan, dan URL gambar Unsplash tetap ada karena bukan request API data.
