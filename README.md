# Chicken Banyard ERP

Aplikasi ERP operasional peternakan dan penjualan telur berbasis Next.js.
Project ini mencakup modul sales order, procurement, goods receipt, pembayaran, stok, pricing, jurnal, dan reporting.

Dokumen Functional/Non-functional Requirement:
https://docs.google.com/spreadsheets/d/1hAT30pDxBKuAfm1Uj_SFtKQG0wu92FXrENhwsiKBGyk/edit?hl=id&gid=0#gid=0

## 1) Gambaran Singkat

Tujuan project ini adalah menyatukan proses bisnis harian farm dalam satu dashboard:

- Sales Order dan delivery
- Pembelian operasional (procurement)
- Goods Receipt (barang masuk)
- Pembayaran cash-in dan cash-out
- Kontrol stok dan gudang
- Price master dan harga telur per kg
- Jurnal transaksi
- Ringkasan laporan

## 2) Stack Teknologi

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Zustand (state management lokal/offline)
- Supabase client (sudah disiapkan di util dan service)

## 3) Prasyarat

Pastikan environment lokal sudah punya:

- Node.js 20 LTS (disarankan)
- npm 10+
- Git

Cek versi:

```bash
node -v
npm -v
git --version
```

## 4) Step by Step Menjalankan Project

### Step 1 - Clone repository

```bash
git clone https://github.com/ArkaanHilmiS/chicken_banyard.git
cd chicken_banyard
```

### Step 2 - Install dependency

```bash
npm install
```

### Step 3 - Siapkan file environment

Buat file `.env.local` di root project, lalu isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Catatan:

- Untuk mode UI offline/local store, halaman tetap bisa dibuka walau belum memakai query Supabase langsung di semua modul.
- Variabel env di atas tetap penting karena client Supabase sudah diinisialisasi dalam project.

### Step 4 - Jalankan mode development

```bash
npm run dev
```

Buka browser ke:

```text
http://localhost:3000
```

### Step 5 - Build production (opsional)

```bash
npm run build
npm run start
```

### Step 6 - Lint check (opsional)

```bash
npm run lint
```

## 5) Akun Demo Lokal

Project ini memiliki seed user lokal pada state store:

- Email: `admin@chicken.local`
- Password: `admin123`

Halaman login ada di `/login` dan register di `/register`.

## 6) Isi Project (Modul Aplikasi)

Ringkasan modul pada folder `src/app`:

- `/` (Overview): landing modul ERP dan pintasan fitur utama.
- `/dashboard`: KPI harian dan quick actions operasional.
- `/order`: input sales order, metode layanan, status order.
- `/procurement`: input pembelian vendor (pakan, utilitas, dll).
- `/goods-receipt`: validasi barang diterima sebelum masuk stok.
- `/master-data`: kelola customer/vendor/supplier/stakeholder.
- `/item-master`: kelola SKU, kategori, harga default, minimum stok.
- `/price-master`: kelola harga per item, per UoM, tipe harga.
- `/uom-master`: kelola satuan unit (kg, sak, paket, liter, dst).
- `/payment`: pencatatan cash-in/cash-out dan referensi transaksi.
- `/stock`: stok masuk/keluar/adjustment per gudang.
- `/price`: input harga telur per kg.
- `/journal`: pencatatan jurnal transaksi (cash-in/cash-out/adjustment).
- `/report`: ringkasan performa dan tombol export laporan.
- `/profile`: update profil user aktif.
- `/login` dan `/register`: autentikasi lokal berbasis store.

## 7) Struktur Folder Utama

```text
src/
	app/              -> Halaman route per modul ERP (App Router)
	components/       -> Komponen UI, layout, dan form
	lib/              -> Utilitas bisnis lokal (offline store, formatter, whatsapp)
	services/         -> Abstraksi akses data Supabase per domain
	types/            -> Definisi tipe data domain (order, payment, stock, dll)
	utils/            -> Utility umum (supabase client)
public/
	images/           -> Aset statis gambar
```

## 8) Alur Data Saat Ini

- UI modul saat ini dominan menggunakan Zustand store dari `src/lib/offlineStore.ts`.
- Beberapa service Supabase sudah tersedia di folder `src/services` sebagai fondasi integrasi database.
- Ini membuat pengembangan UI tetap bisa berjalan cepat sambil bertahap menghubungkan modul ke backend Supabase penuh.

## 9) Scripts NPM

- `npm run dev` -> jalankan development server (Turbopack)
- `npm run build` -> build production
- `npm run start` -> start hasil build
- `npm run lint` -> linting Next.js

## 10) Catatan Pengembangan Lanjutan

Rekomendasi lanjutan untuk roadmap:

- Hubungkan semua modul form/list ke service Supabase secara konsisten.
- Tambahkan proteksi route berbasis role user.
- Tambahkan test (unit/integration) untuk fungsi bisnis kritikal.
- Aktifkan export laporan nyata (XLSX/PDF/CSV) dari data transaksi aktual.

---

Project ini disusun untuk kebutuhan operasional nyata bisnis telur skala UMKM dengan fokus ke alur kerja yang praktis dan mudah dikembangkan.