"use client";

import Link from "next/link";
import { useOfflineStore } from "@/lib/offlineStore";

export default function GuidePage() {
  const locale = useOfflineStore((state) => state.locale);

  const copy = {
    id: {
      title: "Cara Penggunaan",
      subtitle: "Panduan cepat alur kerja harian dan fungsi modul utama.",
      stepsTitle: "Langkah Utama",
      steps: [
        "Lengkapi Master Data, Master Item, UoM, dan COA sebagai referensi awal.",
        "Input transaksi harian di Sales Order atau Pengadaan sesuai kebutuhan.",
        "Catat penerimaan barang di Penerimaan agar stok bertambah.",
        "Rekam pembayaran di Pembayaran untuk update status SO/PO.",
        "Pantau ringkasan di Dashboard, Jurnal, dan Laporan.",
      ],
      modulesTitle: "Penjelasan Modul",
      modules: [
        {
          href: "/order",
          title: "Sales Order",
          description: "Buat pesanan pelanggan, atur layanan, dan pantau status.",
        },
        {
          href: "/payment",
          title: "Pembayaran",
          description: "Catat cash-in/cash-out untuk SO/PO dan biaya operasional.",
        },
        {
          href: "/delivery-order",
          title: "Pengiriman",
          description: "Kelola pengiriman order paid hingga delivered.",
        },
        {
          href: "/procurement",
          title: "Pengadaan",
          description: "Buat PO pembelian kebutuhan farm seperti pakan dan utilitas.",
        },
        {
          href: "/goods-receipt",
          title: "Penerimaan",
          description: "Validasi barang diterima beserta kondisi dan kuantitas.",
        },
        {
          href: "/stock",
          title: "Stok",
          description: "Pantau stok masuk-keluar per item.",
        },
        {
          href: "/price",
          title: "Harga",
          description: "Kelola harga jual/beli berdasarkan periode dan pasar.",
        },
        {
          href: "/master-data",
          title: "Master Data",
          description: "Kelola customer, vendor, supplier, dan profil transaksi.",
        },
        {
          href: "/item-master",
          title: "Master Item",
          description: "Kelola SKU, kategori, harga default, dan minimum stok.",
        },
        {
          href: "/uom-master",
          title: "Master UoM",
          description: "Kelola satuan seperti kg, sak, paket, dan lainnya.",
        },
        {
          href: "/coa",
          title: "COA",
          description: "Atur kode akun untuk pencatatan jurnal.",
        },
        {
          href: "/dashboard",
          title: "Dashboard",
          description: "Ringkasan KPI harian dan antrean operasional.",
        },
        {
          href: "/journal",
          title: "Jurnal",
          description: "Rekap jurnal dari transaksi penjualan dan pembelian.",
        },
        {
          href: "/report",
          title: "Laporan",
          description: "Laporan operasional untuk evaluasi bisnis.",
        },
      ],
    },
    en: {
      title: "How to Use",
      subtitle: "Quick guide for daily workflow and key modules.",
      stepsTitle: "Core Steps",
      steps: [
        "Set up Master Data, Item Master, UoM, and COA as your initial references.",
        "Record daily transactions in Sales Order or Procurement as needed.",
        "Confirm received goods in Goods Receipt to update inventory.",
        "Record payments in Payment to update SO/PO status.",
        "Monitor summaries in Dashboard, Journal, and Report.",
      ],
      modulesTitle: "Module Guide",
      modules: [
        {
          href: "/order",
          title: "Sales Order",
          description: "Create customer orders, set service method, and monitor status.",
        },
        {
          href: "/payment",
          title: "Payment",
          description: "Record cash-in/out for SO/PO and operating expenses.",
        },
        {
          href: "/delivery-order",
          title: "Delivery Order",
          description: "Manage paid orders delivery until marked delivered.",
        },
        {
          href: "/procurement",
          title: "Procurement",
          description: "Create POs for farm needs like feed and utilities.",
        },
        {
          href: "/goods-receipt",
          title: "Goods Receipt",
          description: "Validate received goods, condition, and quantity.",
        },
        {
          href: "/stock",
          title: "Inventory",
          description: "Track stock in/out per item.",
        },
        {
          href: "/price",
          title: "Pricing",
          description: "Manage selling/buying prices by period and market.",
        },
        {
          href: "/master-data",
          title: "Master Data",
          description: "Manage customers, vendors, suppliers, and transaction profiles.",
        },
        {
          href: "/item-master",
          title: "Item Master",
          description: "Manage SKUs, categories, default prices, and minimum stock.",
        },
        {
          href: "/uom-master",
          title: "UoM Master",
          description: "Manage units such as kg, sack, pack, and more.",
        },
        {
          href: "/coa",
          title: "COA",
          description: "Set account codes for journal entries.",
        },
        {
          href: "/dashboard",
          title: "Dashboard",
          description: "Daily KPI summary and operations queue.",
        },
        {
          href: "/journal",
          title: "Journal",
          description: "Journal recap from sales and purchase transactions.",
        },
        {
          href: "/report",
          title: "Report",
          description: "Operational reports for business review.",
        },
      ],
    },
  };

  const t = copy[locale];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">ERP Guide</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{t.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{t.subtitle}</p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t.stepsTitle}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm text-slate-600">
          {t.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t.modulesTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {t.modules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700"
            >
              <p className="text-base font-semibold text-slate-900">{module.title}</p>
              <p className="mt-2 text-sm text-slate-600">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
