"use client";
import Link from "next/link";

export default function Home() {
  const modules = [
    {
      href: "/order",
      title: "Sales Order",
      description: "Buat pesanan telur, atur metode layanan, dan monitor status delivery.",
    },
    {
      href: "/payment",
      title: "Payment",
      description: "Pantau cash in dari sales dan cash out untuk biaya operasional.",
    },
    {
      href: "/delivery-order",
      title: "Delivery Order",
      description: "Kelola pengiriman order berstatus paid dan tandai saat sudah diantar.",
    },
    {
      href: "/procurement",
      title: "Procurement",
      description: "Kelola pembelian listrik, air, pakan, ayam baru, dan kebutuhan farm.",
    },
    {
      href: "/goods-receipt",
      title: "Goods Receipt",
      description: "Validasi barang diterima dari vendor sebelum masuk ke inventory.",
    },
    {
      href: "/master-data",
      title: "Master Data",
      description: "Kelola customer, vendor, supplier, stakeholder, NPWP, rekening, dan preferensi transaksi.",
    },
    {
      href: "/item-master",
      title: "Item Master",
      description: "Kelola SKU item, harga beli/jual default, kategori, dan minimum stock.",
    },
    {
      href: "/price-master",
      title: "Price Master",
      description: "Kelola harga item per unit dan tipe harga (purchase, selling, wholesale, retail).",
    },
    {
      href: "/uom-master",
      title: "UoM Master",
      description: "Kelola unit of measure seperti kg, sak, paket, liter, dan lainnya.",
    },
    {
      href: "/stock",
      title: "Inventory",
      description: "Kontrol stok masuk-keluar harian agar supply tetap stabil.",
    },
    {
      href: "/journal",
      title: "Journal",
      description: "Pencatatan transaksi akuntansi untuk laba, biaya, dan arus kas.",
    },
    {
      href: "/price",
      title: "Pricing",
      description: "Kelola harga per kg berdasarkan dinamika pasar dan periode panen.",
    },
    {
      href: "/report",
      title: "Report",
      description: "Laporan operasional dan performa bisnis untuk keputusan cepat.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Integrated ERP</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl text-emerald-400">Chicken Banyard Control Tower</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
          Satu sistem untuk sales, purchasing, payment, goods receipt, inventory, dan jurnal. Semua proses operasional peternakan telur terhubung dalam alur kerja yang konsisten.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            Buka Dashboard
          </Link>
          <Link href="/order" className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold hover:border-slate-300">
            Buat Sales Order
          </Link>
          <Link href="/procurement" className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold hover:border-slate-300">
            Buat Pembelian
          </Link>
          <Link href="/master-data" className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold hover:border-slate-300">
            Kelola Master Data
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-slate-900 transition group-hover:text-emerald-700">{module.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{module.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
