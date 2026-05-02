"use client";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Journal } from "@/types/journal";
import { formatRupiah } from "@/lib/formatter";
import type { ChartOfAccount } from "@/types/coa";

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

export default function JournalPage() {
  const journals = useOfflineStore((state) => state.journals);
  const addJournal = useOfflineStore((state) => state.addJournal);
  const chartOfAccounts = useOfflineStore((state) => state.chartOfAccounts);
  const locale = useOfflineStore((state) => state.locale);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Journal["category"] | "">("");
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [accountCode, setAccountCode] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Journal["category"] | "">("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const operationalExpenseKeywords = locale === "en"
    ? ["electricity", "water", "feed", "chicken", "operational"]
    : ["listrik", "air", "pakan", "ayam", "operasional"];

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

  const sourceOptions = [
    { value: "orders", label: sourceLabelMap.orders },
    { value: "payments", label: sourceLabelMap.payments },
    { value: "purchases", label: sourceLabelMap.purchases },
    { value: "goods_receipts", label: sourceLabelMap.goods_receipts },
    { value: "stocks", label: sourceLabelMap.stocks },
    { value: "manual", label: sourceLabelMap.manual },
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

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !type) {
      setMsg(locale === "en" ? "All fields are required." : "Semua field wajib diisi.");
      return;
    }

    addJournal({
      description,
      amount: Number(amount),
      category,
      type,
    });

    setMsg(locale === "en" ? "Journal entry added successfully." : "Jurnal berhasil ditambahkan.");
    setDescription("");
    setAmount("");
    setCategory("");
    setType("");
  };

  const filteredJournals = useMemo(
    () => journals.filter((entry) => {
      if (dateFrom && entry.transaction_date < dateFrom) return false;
      if (dateTo && entry.transaction_date > dateTo) return false;
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

  const expenseRows = useMemo(
    () => filteredJournals.filter((j) => j.category === "beban"),
    [filteredJournals],
  );

  const operationalRows = useMemo(
    () => filteredJournals.filter((j) => {
      const text = `${j.description} ${j.type}`.toLowerCase();
      return operationalExpenseKeywords.some((keyword) => text.includes(keyword));
    }),
    [filteredJournals, operationalExpenseKeywords],
  );

  const expenseTotal = useMemo(
    () => expenseRows.reduce((sum, row) => sum + row.amount, 0),
    [expenseRows],
  );

  const operationalTotal = useMemo(
    () => operationalRows.reduce((sum, row) => sum + row.amount, 0),
    [operationalRows],
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

  const balance = journalTotals.debit - journalTotals.credit;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleAddJournal} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Journal Ledger" : "Journal Ledger"}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "en"
                ? "Debit and credit are calculated automatically based on cash flow type and account category."
                : "Debit dan kredit dihitung otomatis berdasarkan jenis arus dan kategori akun."}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={locale === "en" ? "Transaction description" : "Deskripsi transaksi"} className="w-full" required />
            <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={locale === "en" ? "Amount" : "Nominal"} className="w-full" required />
            <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as Journal["category"] | "")} required className="w-full" />
            <Select options={typeOptions} value={type} onChange={(e) => setType(e.target.value)} required className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{locale === "en" ? "+ Add Journal" : "+ Tambah Jurnal"}</Button>
            {msg && (
              <p className={`text-sm ${msg.toLowerCase().includes("success") || msg.toLowerCase().includes("berhasil") ? "text-emerald-700" : "text-rose-600"}`}>
                {msg}
              </p>
            )}
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs uppercase tracking-wide text-emerald-700">{locale === "en" ? "Total Debit" : "Total Debit"}</p>
            <p className="mt-1 text-xl font-semibold text-emerald-900">{formatRupiah(journalTotals.debit)}</p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-xs uppercase tracking-wide text-rose-700">{locale === "en" ? "Total Credit" : "Total Kredit"}</p>
            <p className="mt-1 text-xl font-semibold text-rose-900">{formatRupiah(journalTotals.credit)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-600">{locale === "en" ? "Total Expense" : "Total Beban"}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{formatRupiah(expenseTotal)}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">{locale === "en" ? "Operational Expense" : "Beban Operasional"}</p>
            <p className="mt-1 text-xl font-semibold text-amber-900">{formatRupiah(operationalTotal)}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">{locale === "en" ? "Balance (Debit - Credit):" : "Saldo (Debit - Kredit):"} {formatRupiah(balance)}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Journal Filters" : "Filter Jurnal"}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "en"
                ? `Showing ${filteredJournals.length} of ${journals.length} entries.`
                : `Menampilkan ${filteredJournals.length} dari ${journals.length} entry.`}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full" />
          <Select options={accountOptions} value={accountCode} onChange={(e) => setAccountCode(e.target.value)} className="w-full" />
          <Select options={typeOptions} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full" />
          <Select options={categoryOptions} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as Journal["category"] | "")} className="w-full" />
          <Select options={sourceOptions} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full" />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Date" : "Tanggal"}</th>
                <th className="p-3">{locale === "en" ? "Description" : "Deskripsi"}</th>
                <th className="p-3">{locale === "en" ? "Reference" : "Referensi"}</th>
                <th className="p-3">{locale === "en" ? "Type" : "Jenis"}</th>
                <th className="p-3">{locale === "en" ? "Account Category" : "Kategori Akun"}</th>
                <th className="p-3">{locale === "en" ? "Account" : "Akun"}</th>
                <th className="p-3">{locale === "en" ? "Debit" : "Debit"}</th>
                <th className="p-3">{locale === "en" ? "Credit" : "Kredit"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {filteredJournals.map((j) => {
                const { debit, credit } = resolveDebitCredit(j);
                const account = accountByCategory.get(j.category);
                const accountLabel = account ? `${account.code} - ${account.name}` : "-";
                const typeLabel = typeLabelMap[j.type] ?? j.type;
                const categoryLabel = categoryLabelMap[j.category] ?? j.category;
                const sourceLabel = sourceLabelMap[j.ref_table ?? "manual"] ?? j.ref_table ?? "manual";
                const reference = j.ref_id ? `${sourceLabel}:${j.ref_id}` : "-";

                return (
                  <tr key={j.id} className="border-b border-slate-100">
                    <td className="p-3">{j.transaction_date}</td>
                    <td className="p-3">{j.description}</td>
                    <td className="p-3">{reference}</td>
                    <td className="p-3">{typeLabel}</td>
                    <td className="p-3">{categoryLabel}</td>
                    <td className="p-3">{accountLabel}</td>
                    <td className="p-3">{debit ? formatRupiah(debit) : "-"}</td>
                    <td className="p-3">{credit ? formatRupiah(credit) : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
