"use client";

import { useMemo, useState } from "react";
import { useOfflineStore } from "@/lib/offlineStore";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import type { Journal } from "@/types/journal";
import type { Payment } from "@/types/payment";
import type { ChartOfAccount } from "@/types/coa";
import { formatRupiah } from "@/lib/formatter";

const debitCategories: Journal["category"][] = ["aset", "beban"];
const creditCategories: Journal["category"][] = ["liabilitas", "modal", "pendapatan"];

const resolveDebitCredit = (entry: Journal) => {
  const amount = entry.amount || 0;
  if (entry.type === "cash-in") return { debit: amount, credit: 0 };
  if (entry.type === "cash-out") return { debit: 0, credit: amount };
  if (entry.type === "adjustment") {
    if (debitCategories.includes(entry.category)) return { debit: amount, credit: 0 };
    if (creditCategories.includes(entry.category)) return { debit: 0, credit: amount };
  }
  return { debit: 0, credit: 0 };
};

export default function ReportPage() {
  const orders = useOfflineStore((state) => state.orders);
  const purchases = useOfflineStore((state) => state.purchases);
  const payments = useOfflineStore((state) => state.payments);
  const goodsReceipts = useOfflineStore((state) => state.goodsReceipts);
  const journals = useOfflineStore((state) => state.journals);
  const chartOfAccounts = useOfflineStore((state) => state.chartOfAccounts);
  const locale = useOfflineStore((state) => state.locale);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Journal["category"] | "">("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const getDirection = (payment: Payment) => {
    if (payment.payment_direction) return payment.payment_direction;
    return payment.order_id ? "incoming" : "outgoing";
  };

  const categoryLabelMap: Record<Journal["category"], string> = {
    pendapatan: locale === "en" ? "Revenue" : "Pendapatan",
    beban: locale === "en" ? "Expense" : "Beban",
    aset: locale === "en" ? "Asset" : "Aset",
    liabilitas: locale === "en" ? "Liability" : "Liabilitas",
    modal: locale === "en" ? "Equity" : "Modal",
  };

  const typeLabelMap: Record<string, string> = {
    "cash-in": locale === "en" ? "Cash In" : "Cash In",
    "cash-out": locale === "en" ? "Cash Out" : "Cash Out",
    adjustment: locale === "en" ? "Adjustment" : "Penyesuaian",
  };

  const sourceLabelMap: Record<string, string> = {
    orders: locale === "en" ? "Orders" : "Orders",
    payments: locale === "en" ? "Payments" : "Payments",
    purchases: locale === "en" ? "Purchases" : "Purchases",
    goods_receipts: locale === "en" ? "Goods Receipt" : "Goods Receipt",
    stocks: locale === "en" ? "Stock" : "Stok",
    manual: locale === "en" ? "Manual" : "Manual",
  };

  const sourceOptions = [
    { value: "orders", label: sourceLabelMap.orders },
    { value: "payments", label: sourceLabelMap.payments },
    { value: "purchases", label: sourceLabelMap.purchases },
    { value: "goods_receipts", label: sourceLabelMap.goods_receipts },
    { value: "stocks", label: sourceLabelMap.stocks },
    { value: "manual", label: sourceLabelMap.manual },
  ];

  const categoryOptions = [
    { value: "pendapatan", label: categoryLabelMap.pendapatan },
    { value: "beban", label: categoryLabelMap.beban },
    { value: "aset", label: categoryLabelMap.aset },
    { value: "liabilitas", label: categoryLabelMap.liabilitas },
    { value: "modal", label: categoryLabelMap.modal },
  ];

  const typeOptions = [
    { value: "cash-in", label: typeLabelMap["cash-in"] },
    { value: "cash-out", label: typeLabelMap["cash-out"] },
    { value: "adjustment", label: typeLabelMap.adjustment },
  ];

  const accountOptions = useMemo(
    () => chartOfAccounts
      .filter((account) => account.is_active)
      .map((account) => ({ value: account.code, label: `${account.code} - ${account.name}` })),
    [chartOfAccounts],
  );

  const accountByCategory = useMemo(() => {
    const map = new Map<Journal["category"], ChartOfAccount>();
    chartOfAccounts.forEach((account) => {
      map.set(account.category, account);
    });
    return map;
  }, [chartOfAccounts]);

  const isWithinDate = (dateValue: string) => {
    if (dateFrom && dateValue < dateFrom) return false;
    if (dateTo && dateValue > dateTo) return false;
    return true;
  };

  const filteredOrders = useMemo(
    () => orders.filter((order) => isWithinDate(order.order_date)),
    [orders, dateFrom, dateTo],
  );

  const filteredPurchases = useMemo(
    () => purchases.filter((purchase) => isWithinDate(purchase.purchase_date)),
    [purchases, dateFrom, dateTo],
  );

  const filteredPayments = useMemo(
    () => payments.filter((payment) => isWithinDate(payment.payment_date)),
    [payments, dateFrom, dateTo],
  );

  const filteredGoodsReceipts = useMemo(
    () => goodsReceipts.filter((receipt) => isWithinDate(receipt.receipt_date)),
    [goodsReceipts, dateFrom, dateTo],
  );

  const filteredJournals = useMemo(
    () => journals.filter((entry) => {
      if (!isWithinDate(entry.transaction_date)) return false;
      if (typeFilter && entry.type !== typeFilter) return false;
      if (categoryFilter && entry.category !== categoryFilter) return false;
      if (sourceFilter) {
        const source = entry.ref_table ?? "manual";
        if (source !== sourceFilter) return false;
      }
      if (accountCode) {
        const account = accountByCategory.get(entry.category);
        if (!account || account.code !== accountCode) return false;
      }
      return true;
    }),
    [journals, dateFrom, dateTo, typeFilter, categoryFilter, sourceFilter, accountCode, accountByCategory],
  );

  const paidIncoming = useMemo(
    () => filteredPayments.filter((payment) => getDirection(payment) === "incoming" && payment.is_paid),
    [filteredPayments],
  );

  const paidOutgoing = useMemo(
    () => filteredPayments.filter((payment) => getDirection(payment) === "outgoing" && payment.is_paid),
    [filteredPayments],
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
    () => filteredPurchases.reduce((sum, purchase) => sum + purchase.total_price, 0),
    [filteredPurchases],
  );

  const netCashflow = useMemo(
    () => revenueTotal - operationalTotal,
    [revenueTotal, operationalTotal],
  );

  const orderSummary = useMemo(
    () => ({
      pending: filteredOrders.filter((order) => order.order_status === "pending").length,
      paid: filteredOrders.filter((order) => order.order_status === "paid").length,
      delivered: filteredOrders.filter((order) => order.order_status === "delivered").length,
      cancelled: filteredOrders.filter((order) => order.order_status === "cancelled").length,
    }),
    [filteredOrders],
  );

  const purchaseSummary = useMemo(
    () => ({
      pending: filteredPurchases.filter((purchase) => purchase.payment_status === "pending").length,
      paid: filteredPurchases.filter((purchase) => purchase.payment_status === "paid").length,
      partial: filteredPurchases.filter((purchase) => purchase.payment_status === "partial").length,
    }),
    [filteredPurchases],
  );

  const latestJournals = useMemo(
    () => [...filteredJournals]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 8),
    [filteredJournals],
  );

  const journalTotals = useMemo(
    () => filteredJournals.reduce(
      (acc, entry) => {
        const { debit, credit } = resolveDebitCredit(entry);
        acc.debit += debit;
        acc.credit += credit;
        return acc;
      },
      { debit: 0, credit: 0 },
    ),
    [filteredJournals],
  );

  const journalBalance = journalTotals.debit - journalTotals.credit;

  const journalCategorySummary = useMemo(() => {
    const summaryMap = new Map<string, { debit: number; credit: number; count: number }>();
    filteredJournals.forEach((entry) => {
      const { debit, credit } = resolveDebitCredit(entry);
      const existing = summaryMap.get(entry.category) || { debit: 0, credit: 0, count: 0 };
      existing.debit += debit;
      existing.credit += credit;
      existing.count += 1;
      summaryMap.set(entry.category, existing);
    });

    return Array.from(summaryMap.entries())
      .map(([category, value]) => ({ category, ...value }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredJournals]);

  const summaries = [
    { label: locale === "en" ? "Revenue Paid" : "Pendapatan Dibayar", value: formatRupiah(revenueTotal) },
    { label: locale === "en" ? "Operational Expense" : "Biaya Operasional", value: formatRupiah(operationalTotal) },
    { label: locale === "en" ? "Procurement Spend" : "Belanja Procurement", value: formatRupiah(procurementTotal) },
    { label: locale === "en" ? "Net Cashflow" : "Cashflow Bersih", value: formatRupiah(netCashflow) },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Reporting Center" : "Reporting Center"}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en"
            ? "Performance summary for sales, procurement, cash flow, and farm operations."
            : "Ringkasan performa sales, procurement, cash in and out, dan operasional farm."}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Report Filters" : "Filter Report"}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "en"
                ? "Filter summaries by date range and account."
                : "Filter ringkasan berdasarkan periode dan akun."}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Date From" : "Tanggal Mulai"}</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Date To" : "Tanggal Akhir"}</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Account" : "Akun"}</label>
            <Select options={accountOptions} value={accountCode} onChange={(e) => setAccountCode(e.target.value)} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Type" : "Jenis"}</label>
            <Select options={typeOptions} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Category" : "Kategori"}</label>
            <Select options={categoryOptions} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as Journal["category"] | "")} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Source" : "Sumber"}</label>
            <Select options={sourceOptions} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full" />
          </div>
        </div>
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
          <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Sales Order Status" : "Status Sales Order"}</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>{locale === "en" ? "Pending" : "Pending"}: {orderSummary.pending}</p>
            <p>{locale === "en" ? "Paid" : "Paid"}: {orderSummary.paid}</p>
            <p>{locale === "en" ? "Delivered" : "Delivered"}: {orderSummary.delivered}</p>
            <p>{locale === "en" ? "Cancelled" : "Dibatalkan"}: {orderSummary.cancelled}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Procurement Status" : "Status Procurement"}</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>{locale === "en" ? "Pending" : "Pending"}: {purchaseSummary.pending}</p>
            <p>{locale === "en" ? "Paid" : "Paid"}: {purchaseSummary.paid}</p>
            <p>{locale === "en" ? "Partial" : "Partial"}: {purchaseSummary.partial}</p>
            <p>{locale === "en" ? "Total PO" : "Total PO"}: {filteredPurchases.length}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Goods Receipt" : "Goods Receipt"}</h2>
          <div className="mt-3 space-y-1 text-sm text-slate-600">
            <p>{locale === "en" ? "Total GRN" : "Total GRN"}: {filteredGoodsReceipts.length}</p>
            <p>{locale === "en" ? "Payment Incoming" : "Pembayaran Masuk"}: {paidIncoming.length}</p>
            <p>{locale === "en" ? "Payment Outgoing" : "Pembayaran Keluar"}: {paidOutgoing.length}</p>
          </div>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-emerald-900">{locale === "en" ? "Total Debit" : "Total Debit"}</h2>
          <p className="mt-2 text-2xl font-semibold text-emerald-900">{formatRupiah(journalTotals.debit)}</p>
          <p className="mt-1 text-xs text-emerald-700">{locale === "en" ? "Based on journal entries" : "Berdasarkan jurnal transaksi"}</p>
        </article>
        <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-rose-900">{locale === "en" ? "Total Credit" : "Total Kredit"}</h2>
          <p className="mt-2 text-2xl font-semibold text-rose-900">{formatRupiah(journalTotals.credit)}</p>
          <p className="mt-1 text-xs text-rose-700">{locale === "en" ? "Based on journal entries" : "Berdasarkan jurnal transaksi"}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Journal Balance" : "Saldo Jurnal"}</h2>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatRupiah(journalBalance)}</p>
          <p className="mt-1 text-xs text-slate-500">{locale === "en" ? "Debit - Credit" : "Debit - Kredit"}</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Account Summary (Debit/Credit)" : "Rekap Akun (Debit/Kredit)"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en" ? "Journal summary by account category for accounting analysis." : "Ringkasan jurnal per kategori akun untuk analisis akuntansi."}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Account" : "Akun"}</th>
                <th className="p-3">{locale === "en" ? "Debit" : "Debit"}</th>
                <th className="p-3">{locale === "en" ? "Credit" : "Kredit"}</th>
                <th className="p-3">{locale === "en" ? "Entries" : "Entry"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {journalCategorySummary.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={4}>{locale === "en" ? "No journal entries yet." : "Belum ada jurnal tercatat."}</td>
                </tr>
              ) : (
                journalCategorySummary.map((row) => {
                  const account = accountByCategory.get(row.category as Journal["category"]);
                  const accountLabel = account ? `${account.code} - ${account.name}` : (categoryLabelMap[row.category as Journal["category"]] ?? row.category);

                  return (
                    <tr key={row.category} className="border-b border-slate-100">
                      <td className="p-3">{accountLabel}</td>
                      <td className="p-3">{row.debit ? formatRupiah(row.debit) : "-"}</td>
                      <td className="p-3">{row.credit ? formatRupiah(row.credit) : "-"}</td>
                      <td className="p-3">{row.count}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Latest Journals" : "Jurnal Terbaru"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en" ? "All transactions are recorded automatically in the journal." : "Seluruh transaksi tercatat otomatis pada jurnal."}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Date" : "Tanggal"}</th>
                <th className="p-3">{locale === "en" ? "Description" : "Deskripsi"}</th>
                <th className="p-3">{locale === "en" ? "Account" : "Akun"}</th>
                <th className="p-3">{locale === "en" ? "Debit" : "Debit"}</th>
                <th className="p-3">{locale === "en" ? "Credit" : "Kredit"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {latestJournals.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={5}>{locale === "en" ? "No journal entries yet." : "Belum ada jurnal tercatat."}</td>
                </tr>
              ) : (
                latestJournals.map((journal) => {
                  const { debit, credit } = resolveDebitCredit(journal);
                  const account = accountByCategory.get(journal.category);
                  const accountLabel = account ? `${account.code} - ${account.name}` : (categoryLabelMap[journal.category] ?? journal.category);

                  return (
                    <tr key={journal.id} className="border-b border-slate-100">
                      <td className="p-3">{journal.transaction_date}</td>
                      <td className="p-3">{journal.description}</td>
                      <td className="p-3">{accountLabel}</td>
                      <td className="p-3">{debit ? formatRupiah(debit) : "-"}</td>
                      <td className="p-3">{credit ? formatRupiah(credit) : "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Export Reports" : "Export Laporan"}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">
            {locale === "en" ? "Sales Report (XLSX)" : "Laporan Penjualan (XLSX)"}
          </button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">
            {locale === "en" ? "Procurement Report (XLSX)" : "Laporan Procurement (XLSX)"}
          </button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">
            {locale === "en" ? "Goods Receipt Report (XLSX)" : "Laporan Goods Receipt (XLSX)"}
          </button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">
            {locale === "en" ? "Cash Flow Report (PDF)" : "Laporan Arus Kas (PDF)"}
          </button>
          <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-500">
            {locale === "en" ? "Operational Expense Summary (CSV)" : "Rekap Beban Operasional (CSV)"}
          </button>
        </div>
      </section>
    </div>
  );
}
