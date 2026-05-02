"use client";

import { useMemo } from "react";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Payment } from "@/types/payment";
import { formatRupiah } from "@/lib/formatter";

export default function ReportPage() {
  const orders = useOfflineStore((state) => state.orders);
  const purchases = useOfflineStore((state) => state.purchases);
  const payments = useOfflineStore((state) => state.payments);
  const goodsReceipts = useOfflineStore((state) => state.goodsReceipts);
  const journals = useOfflineStore((state) => state.journals);

  const getDirection = (payment: Payment) => {
    if (payment.payment_direction) return payment.payment_direction;
    return payment.order_id ? "incoming" : "outgoing";
  };

  const paidIncoming = useMemo(
    () => payments.filter((payment) => getDirection(payment) === "incoming" && payment.is_paid),
    [payments],
  );

  const paidOutgoing = useMemo(
    () => payments.filter((payment) => getDirection(payment) === "outgoing" && payment.is_paid),
    [payments],
  );

  const revenueTotal = useMemo(
    () => paidIncoming.reduce((sum, payment) => sum + payment.amount, 0),
    [paidIncoming],
  );

  const operationalTotal = useMemo(
    () => paidOutgoing.reduce((sum, payment) => sum + payment.amount, 0),
    [paidOutgoing],
  );

  const procurementTotal = useMemo(
    () => purchases.reduce((sum, purchase) => sum + purchase.total_price, 0),
    [purchases],
  );

  const netCashflow = useMemo(
    () => revenueTotal - operationalTotal,
    [revenueTotal, operationalTotal],
  );

  const orderSummary = useMemo(
    () => ({
      pending: orders.filter((order) => order.order_status === "pending").length,
      paid: orders.filter((order) => order.order_status === "paid").length,
      delivered: orders.filter((order) => order.order_status === "delivered").length,
      cancelled: orders.filter((order) => order.order_status === "cancelled").length,
    }),
    [orders],
  );

  const purchaseSummary = useMemo(
    () => ({
      pending: purchases.filter((purchase) => purchase.payment_status === "pending").length,
      paid: purchases.filter((purchase) => purchase.payment_status === "paid").length,
      partial: purchases.filter((purchase) => purchase.payment_status === "partial").length,
    }),
    [purchases],
  );

  const latestJournals = useMemo(
    () => [...journals]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 8),
    [journals],
  );

  const summaries = [
    { label: "Revenue Paid", value: formatRupiah(revenueTotal) },
    { label: "Biaya Operasional", value: formatRupiah(operationalTotal) },
    { label: "Belanja Procurement", value: formatRupiah(procurementTotal) },
    { label: "Cashflow Bersih", value: formatRupiah(netCashflow) },
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

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Status Sales Order</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>Pending: {orderSummary.pending}</p>
            <p>Paid: {orderSummary.paid}</p>
            <p>Delivered: {orderSummary.delivered}</p>
            <p>Cancelled: {orderSummary.cancelled}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Status Procurement</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>Pending: {purchaseSummary.pending}</p>
            <p>Paid: {purchaseSummary.paid}</p>
            <p>Partial: {purchaseSummary.partial}</p>
            <p>Total PO: {purchases.length}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Goods Receipt</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>Total GRN: {goodsReceipts.length}</p>
            <p>Payment Incoming: {paidIncoming.length}</p>
            <p>Payment Outgoing: {paidOutgoing.length}</p>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Jurnal Terbaru</h2>
        <p className="mt-1 text-sm text-slate-600">Seluruh transaksi tercatat otomatis pada jurnal.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Jenis</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Nominal</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {latestJournals.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={5}>Belum ada jurnal tercatat.</td>
                </tr>
              ) : (
                latestJournals.map((journal) => (
                  <tr key={journal.id} className="border-b border-slate-100">
                    <td className="p-3">{journal.transaction_date}</td>
                    <td className="p-3">{journal.description}</td>
                    <td className="p-3 capitalize">{journal.type}</td>
                    <td className="p-3 capitalize">{journal.category}</td>
                    <td className="p-3">{formatRupiah(journal.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
