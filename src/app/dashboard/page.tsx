"use client";

import Link from "next/link";

export default function DashboardPage() {
  const kpis = [
    { label: "Order Hari Ini", value: "24", delta: "+12%" },
    { label: "Pendapatan Harian", value: "Rp 8.450.000", delta: "+8%" },
    { label: "Stok Tersedia", value: "1.420 kg", delta: "Aman" },
    { label: "Piutang Pending", value: "Rp 1.900.000", delta: "4 invoice" },
  ];

  const quickActions = [
    { href: "/order", label: "Input Sales Order Baru" },
    { href: "/payment", label: "Verifikasi Pembayaran" },
    { href: "/stock", label: "Update Stok Harian" },
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
          <h2 className="text-lg font-semibold text-slate-900">Queue Operasional</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2">No Order</th>
                  <th className="py-2">Pelanggan</th>
                  <th className="py-2">Layanan</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t border-slate-100">
                  <td className="py-3">SO-240301</td>
                  <td className="py-3">Toko Kuning</td>
                  <td className="py-3">Antar</td>
                  <td className="py-3"><span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Siap Kirim</span></td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3">SO-240302</td>
                  <td className="py-3">Warung Pak Budi</td>
                  <td className="py-3">Ambil</td>
                  <td className="py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">Lunas</span></td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-3">SO-240303</td>
                  <td className="py-3">Agen Sejahtera</td>
                  <td className="py-3">Antar</td>
                  <td className="py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Menunggu Bayar</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
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
