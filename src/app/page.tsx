"use client";
import Link from "next/link";
import { useOfflineStore } from "@/lib/offlineStore";

export default function Home() {
  const locale = useOfflineStore((state) => state.locale);
  const copy = {
    id: {
      heroTag: "Integrated ERP",
      heroTitle: "Dashboard Peternakan Ayam Petelur",
      heroDesc: "Satu sistem untuk sales, purchasing, payment, goods receipt, inventory, dan jurnal. Semua proses operasional peternakan telur terhubung dalam alur kerja yang konsisten.",
      dashboard: "Buka Dashboard",
      createOrder: "Buat Sales Order",
      createProcurement: "Buat Pembelian",
      manageMaster: "Kelola Master Data",
      modules: [
        { href: "/order", title: "Sales Order", description: "Buat pesanan telur, atur metode layanan, dan monitor status delivery." },
        { href: "/payment", title: "Pembayaran", description: "Pantau cash in dari sales dan cash out untuk biaya operasional." },
        { href: "/delivery-order", title: "Pengiriman", description: "Kelola pengiriman order berstatus paid dan tandai saat sudah diantar." },
        { href: "/procurement", title: "Pengadaan", description: "Kelola pembelian listrik, air, pakan, ayam baru, dan kebutuhan farm." },
        { href: "/goods-receipt", title: "Penerimaan", description: "Validasi barang diterima dari vendor sebelum masuk ke inventory." },
        { href: "/master-data", title: "Master Data", description: "Kelola customer, vendor, supplier, stakeholder, NPWP, rekening, dan preferensi transaksi." },
        { href: "/item-master", title: "Master Item", description: "Kelola SKU item, harga beli/jual default, kategori, dan minimum stock." },
        { href: "/uom-master", title: "Master UoM", description: "Kelola unit of measure seperti kg, sak, paket, liter, dan lainnya." },
        { href: "/stock", title: "Stok", description: "Kontrol stok masuk-keluar harian agar supply tetap stabil." },
        { href: "/journal", title: "Jurnal", description: "Pencatatan transaksi akuntansi untuk laba, biaya, dan arus kas." },
        { href: "/price", title: "Harga", description: "Kelola harga per kg berdasarkan dinamika pasar dan periode panen." },
        { href: "/report", title: "Laporan", description: "Laporan operasional dan performa bisnis untuk keputusan cepat." },
      ],
    },
    en: {
      heroTag: "Integrated ERP",
      heroTitle: "Chicken Banyard Control Tower",
      heroDesc: "One system for sales, purchasing, payment, goods receipt, inventory, and journals. All egg farm operations are connected in a consistent workflow.",
      dashboard: "Open Dashboard",
      createOrder: "Create Sales Order",
      createProcurement: "Create Procurement",
      manageMaster: "Manage Master Data",
      modules: [
        { href: "/order", title: "Sales Order", description: "Create egg orders, set service method, and monitor delivery status." },
        { href: "/payment", title: "Payment", description: "Track cash in from sales and cash out for operations." },
        { href: "/delivery-order", title: "Delivery Order", description: "Manage paid orders for delivery and mark them delivered." },
        { href: "/procurement", title: "Procurement", description: "Manage purchases of electricity, water, feed, new chickens, and farm needs." },
        { href: "/goods-receipt", title: "Goods Receipt", description: "Validate received goods from vendors before entering inventory." },
        { href: "/master-data", title: "Master Data", description: "Manage customers, vendors, suppliers, stakeholders, tax IDs, bank accounts, and preferences." },
        { href: "/item-master", title: "Item Master", description: "Manage item SKUs, default purchase/sell prices, categories, and minimum stock." },
        { href: "/uom-master", title: "UoM Master", description: "Manage units of measure such as kg, sack, pack, liter, and more." },
        { href: "/stock", title: "Inventory", description: "Control daily stock in/out to keep supply stable." },
        { href: "/journal", title: "Journal", description: "Accounting entries for profit, expense, and cash flow." },
        { href: "/price", title: "Pricing", description: "Manage egg price per kg based on market dynamics and harvest periods." },
        { href: "/report", title: "Report", description: "Operational and business performance reports for quick decisions." },
      ],
    },
  };

  const t = copy[locale];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{t.heroTag}</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl text-emerald-400">{t.heroTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200 sm:text-base">
          {t.heroDesc}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            {t.dashboard}
          </Link>
          <Link href="/order" className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold hover:border-slate-300">
            {t.createOrder}
          </Link>
          <Link href="/procurement" className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold hover:border-slate-300">
            {t.createProcurement}
          </Link>
          <Link href="/master-data" className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold hover:border-slate-300">
            {t.manageMaster}
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {t.modules.map((module) => (
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
