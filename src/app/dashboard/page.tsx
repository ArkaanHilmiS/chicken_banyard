"use client";

import Link from "next/link";
import { useOfflineStore } from "@/lib/offlineStore";

export default function DashboardPage() {
  const orders = useOfflineStore((state) => state.orders);
  const purchases = useOfflineStore((state) => state.purchases);
  const payments = useOfflineStore((state) => state.payments);
  const goodsReceipts = useOfflineStore((state) => state.goodsReceipts);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";
  const today = new Date().toISOString().slice(0, 10);

  const getDirection = (payment: { order_id: string; payment_direction?: "incoming" | "outgoing" }) => {
    if (payment.payment_direction) return payment.payment_direction;
    return payment.order_id ? "incoming" : "outgoing";
  };

  const todayOrders = orders.filter((order) => order.order_date === today);
  const todayIncomingPayments = payments.filter(
    (payment) => payment.payment_date === today && payment.is_paid && getDirection(payment) === "incoming",
  );
  const todayOutgoingPayments = payments.filter(
    (payment) => payment.payment_date === today && payment.is_paid && getDirection(payment) === "outgoing",
  );
  const pendingPurchases = purchases.filter((purchase) => purchase.payment_status !== "paid");
  const dailyRevenue = todayIncomingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const dailyExpenses = todayOutgoingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPurchasesTotal = pendingPurchases.reduce((sum, purchase) => sum + purchase.total_price, 0);

  const kpis = locale === "en"
    ? [
      { label: "Today Orders", value: String(todayOrders.length), delta: `${todayOrders.length} orders` },
      { label: "Daily Revenue", value: `Rp ${dailyRevenue.toLocaleString(numberLocale)}`, delta: `${todayIncomingPayments.length} payments` },
      { label: "Operational Expenses", value: `Rp ${dailyExpenses.toLocaleString(numberLocale)}`, delta: `${todayOutgoingPayments.length} payments` },
      { label: "Pending Purchases", value: `Rp ${pendingPurchasesTotal.toLocaleString(numberLocale)}`, delta: `${pendingPurchases.length} PO` },
    ]
    : [
      { label: "Order Hari Ini", value: String(todayOrders.length), delta: `${todayOrders.length} order` },
      { label: "Pendapatan Harian", value: `Rp ${dailyRevenue.toLocaleString(numberLocale)}`, delta: `${todayIncomingPayments.length} pembayaran` },
      { label: "Biaya Operasional", value: `Rp ${dailyExpenses.toLocaleString(numberLocale)}`, delta: `${todayOutgoingPayments.length} pembayaran` },
      { label: "Pembelian Pending", value: `Rp ${pendingPurchasesTotal.toLocaleString(numberLocale)}`, delta: `${pendingPurchases.length} PO` },
    ];

  type StatusTone = "good" | "warn" | "neutral" | "danger";

  const statusToneClass = (tone: StatusTone) => {
    if (tone === "good") return "bg-emerald-100 text-emerald-800";
    if (tone === "warn") return "bg-amber-100 text-amber-800";
    if (tone === "danger") return "bg-rose-100 text-rose-800";
    return "bg-slate-100 text-slate-700";
  };

  const queueRows: Array<{
    id: string;
    partner: string;
    type: string;
    status: string;
    tone: StatusTone;
    date: string;
  }> = [
    ...orders.map((order) => {
      const statusLabel = (() => {
        if (order.order_status === "delivered") return locale === "en" ? "Delivered" : "Terkirim";
        if (order.order_status === "cancelled") return locale === "en" ? "Cancelled" : "Dibatalkan";
        if (order.order_status === "paid") return locale === "en" ? "Paid" : "Paid";
        return locale === "en" ? "Pending" : "Pending";
      })();
      const tone: StatusTone = order.order_status === "delivered"
        ? "good"
        : order.order_status === "cancelled"
          ? "danger"
          : "warn";

      return {
        id: String(order.so_number || order.id),
        partner: order.address || "-",
        type: locale === "en" ? "Sales" : "Sales",
        status: statusLabel,
        tone,
        date: order.order_date,
      };
    }),
    ...purchases.map((purchase) => {
      const statusLabel = (() => {
        if (purchase.payment_status === "paid") return locale === "en" ? "Paid" : "Lunas";
        if (purchase.payment_status === "partial") return locale === "en" ? "Partial" : "Parsial";
        return locale === "en" ? "Pending" : "Pending";
      })();
      const tone: StatusTone = purchase.payment_status === "paid"
        ? "good"
        : purchase.payment_status === "partial"
          ? "warn"
          : "neutral";

      return {
        id: String(purchase.po_number || purchase.id),
        partner: purchase.vendor_name || "-",
        type: locale === "en" ? "Purchase" : "Purchase",
        status: statusLabel,
        tone,
        date: purchase.purchase_date,
      };
    }),
    ...goodsReceipts.map((receipt) => {
      const statusLabel = (() => {
        if (receipt.condition === "damaged") return locale === "en" ? "Damaged" : "Rusak";
        if (receipt.condition === "partial") return locale === "en" ? "Partial" : "Parsial";
        return locale === "en" ? "Good" : "Baik";
      })();
      const tone: StatusTone = receipt.condition === "damaged"
        ? "danger"
        : receipt.condition === "partial"
          ? "warn"
          : "good";

      return {
        id: String(receipt.id),
        partner: receipt.vendor_name || "-",
        type: locale === "en" ? "Goods Receipt" : "Goods Receipt",
        status: statusLabel,
        tone,
        date: receipt.receipt_date,
      };
    }),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

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
                {queueRows.length === 0 ? (
                  <tr className="border-t border-slate-100">
                    <td className="py-3 text-slate-500" colSpan={4}>
                      {locale === "en" ? "No operations yet." : "Belum ada aktivitas."}
                    </td>
                  </tr>
                ) : (
                  queueRows.map((row) => (
                    <tr key={`${row.id}-${row.type}`} className="border-t border-slate-100">
                      <td className="py-3">{row.id}</td>
                      <td className="py-3">{row.partner}</td>
                      <td className="py-3">{row.type}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusToneClass(row.tone)}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
