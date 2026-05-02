"use client";

import Link from "next/link";
import { useOfflineStore } from "@/lib/offlineStore";

export default function DashboardPage() {
  const locale = useOfflineStore((state) => state.locale);

  const kpis = locale === "en"
    ? [
      { label: "Today Orders", value: "24", delta: "+12%" },
      { label: "Daily Revenue", value: "Rp 8.450.000", delta: "+8%" },
      { label: "Operational Expenses", value: "Rp 2.130.000", delta: "Electricity, water, feed" },
      { label: "Pending Purchases", value: "Rp 1.900.000", delta: "3 PO" },
    ]
    : [
      { label: "Order Hari Ini", value: "24", delta: "+12%" },
      { label: "Pendapatan Harian", value: "Rp 8.450.000", delta: "+8%" },
      { label: "Biaya Operasional", value: "Rp 2.130.000", delta: "Listrik, air, pakan" },
      { label: "Pembelian Pending", value: "Rp 1.900.000", delta: "3 PO" },
    ];

  const quickActions = locale === "en"
    ? [
      { href: "/order", label: "New Sales Order" },
      { href: "/procurement", label: "New Purchase" },
      { href: "/goods-receipt", label: "Record Goods Receipt" },
      { href: "/master-data", label: "Manage Partner Master Data" },
      { href: "/payment", label: "Record Operational Payment" },
      { href: "/report", label: "Generate Report" },
    ]
    : [
      { href: "/order", label: "Input Sales Order Baru" },
      { href: "/procurement", label: "Input Purchase Baru" },
      { href: "/goods-receipt", label: "Catat Goods Receipt" },
      { href: "/master-data", label: "Kelola Master Data Partner" },
      { href: "/payment", label: "Catat Pembayaran Operasional" },
      { href: "/report", label: "Generate Laporan" },
    ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-emerald-700">{item.delta}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">{locale === "en" ? "Daily Operations Queue" : "Queue Operasional Harian"}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2">{locale === "en" ? "Document" : "Dokumen"}</th>
                  <th className="py-2">{locale === "en" ? "Partner" : "Partner"}</th>
                  <th className="py-2">{locale === "en" ? "Type" : "Jenis"}</th>
                  <th className="py-2">{locale === "en" ? "Status" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t border-slate-100">
                  <td className="py-3">SO-240301</td>
                  <td className="py-3">Toko Kuning</td>
                  <td className="py-3">{locale === "en" ? "Sales" : "Sales"}</td>
                  <td className="py-3"><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">{locale === "en" ? "Ready to Ship" : "Siap Kirim"}</span></td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3">PO-240115</td>
                  <td className="py-3">PLN</td>
                  <td className="py-3">{locale === "en" ? "Utility" : "Utility"}</td>
                  <td className="py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{locale === "en" ? "Awaiting Payment" : "Menunggu Bayar"}</span></td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3">GR-240057</td>
                  <td className="py-3">CV Pakan Jaya</td>
                  <td className="py-3">Goods Receipt</td>
                  <td className="py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">{locale === "en" ? "Posted to Stock" : "Posted ke Stok"}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{locale === "en" ? "Quick Actions" : "Quick Actions"}</h2>
          <div className="mt-4 space-y-2">
            {quickActions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-500 hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
