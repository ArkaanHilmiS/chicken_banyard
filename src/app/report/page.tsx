"use client";

export default function ReportPage() {
  const summaries = [
    { label: "Revenue Bulan Ini", value: "Rp 186.400.000" },
    { label: "Biaya Operasional", value: "Rp 46.700.000" },
    { label: "Belanja Procurement", value: "Rp 28.200.000" },
    { label: "Cashflow Bersih", value: "Rp 111.500.000" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Reporting Center</h1>
        <p className="mt-1 text-sm text-slate-600">Ringkasan performa sales, procurement, cash in and out, dan operasional farm.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaries.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Export Laporan</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">Laporan Penjualan (XLSX)</button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">Laporan Procurement (XLSX)</button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">Laporan Goods Receipt (XLSX)</button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">Laporan Arus Kas (PDF)</button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">Rekap Beban Operasional (CSV)</button>
        </div>
      </section>
    </div>
  );
}
