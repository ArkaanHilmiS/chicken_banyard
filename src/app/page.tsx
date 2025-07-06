"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          Chicken Banyard – Penjualan Telur
        </h1>
        <p className="text-gray-700">
          Sistem pemesanan, pembayaran, & manajemen penjualan telur otomatis untuk UMKM/peternak.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Menu Utama</h2>
        <ul className="grid gap-2">
          <li>
            <Link
              href="/order"
              className="block p-3 bg-blue-50 rounded-md hover:bg-blue-100 font-medium text-blue-800"
            >
              Buat Pesanan
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="block p-3 bg-blue-50 rounded-md hover:bg-blue-100 font-medium text-blue-800"
            >
              Login / Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="block p-3 bg-green-50 rounded-md hover:bg-green-100 font-medium text-green-800"
            >
              Daftar User Baru
            </Link>
          </li>
          <li>
            <Link
              href="/price"
              className="block p-3 bg-yellow-50 rounded-md hover:bg-yellow-100 font-medium text-yellow-800"
            >
              Lihat Daftar Harga Telur
            </Link>
          </li>
          <li>
            <Link
              href="/report"
              className="block p-3 bg-indigo-50 rounded-md hover:bg-indigo-100 font-medium text-indigo-800"
            >
              Laporan Keuangan (Admin)
            </Link>
          </li>
          <li>
            <Link
              href="/stock"
              className="block p-3 bg-pink-50 rounded-md hover:bg-pink-100 font-medium text-pink-800"
            >
              Manajemen Stok Telur
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Tentang Aplikasi</h2>
        <p className="text-gray-600 text-sm">
          Fitur: Order telur, pembayaran QRIS/cash, dashboard keuangan, pengumuman, notifikasi WA, ekspor laporan Excel, dan banyak lagi.<br />
          Silakan login untuk akses fitur admin & pencatatan jurnal otomatis.
        </p>
      </section>
    </main>
  );
}
