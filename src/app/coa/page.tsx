"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { ChartOfAccount } from "@/types/coa";

export default function CoaPage() {
  const chartOfAccounts = useOfflineStore((state) => state.chartOfAccounts);
  const addChartOfAccount = useOfflineStore((state) => state.addChartOfAccount);
  const toggleChartOfAccount = useOfflineStore((state) => state.toggleChartOfAccount);
  const locale = useOfflineStore((state) => state.locale);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ChartOfAccount["category"] | "">("");
  const [isActive, setIsActive] = useState("active");
  const [msg, setMsg] = useState("");

  const categoryOptions = [
    { value: "aset", label: locale === "en" ? "Asset" : "Aset" },
    { value: "liabilitas", label: locale === "en" ? "Liability" : "Liabilitas" },
    { value: "modal", label: locale === "en" ? "Equity" : "Modal" },
    { value: "pendapatan", label: locale === "en" ? "Revenue" : "Pendapatan" },
    { value: "beban", label: locale === "en" ? "Expense" : "Beban" },
  ];

  const statusOptions = [
    { value: "active", label: locale === "en" ? "Active" : "Aktif" },
    { value: "inactive", label: locale === "en" ? "Inactive" : "Tidak Aktif" },
  ];

  const summary = useMemo(() => {
    const activeCount = chartOfAccounts.filter((row) => row.is_active).length;
    return { total: chartOfAccounts.length, active: activeCount };
  }, [chartOfAccounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !category) {
      setMsg(locale === "en" ? "Code, name, and category are required." : "Kode, nama, dan kategori wajib diisi.");
      return;
    }

    const result = addChartOfAccount({
      code,
      name,
      category,
      isActive: isActive === "active",
    });

    setMsg(result.message);
    if (result.ok) {
      setCode("");
      setName("");
      setCategory("");
      setIsActive("active");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Chart of Accounts (COA)" : "Chart of Accounts (COA)"}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en" ? "Manage core accounts for journals and reporting." : "Kelola daftar akun utama untuk kebutuhan jurnal dan laporan."}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={locale === "en" ? "Account code" : "Kode akun"} className="w-full" required />
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={locale === "en" ? "Account name" : "Nama akun"} className="w-full" required />
            <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as ChartOfAccount["category"] | "")} required className="w-full" />
            <Select options={statusOptions} value={isActive} onChange={(e) => setIsActive(e.target.value)} className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{locale === "en" ? "+ Add COA" : "+ Tambah COA"}</Button>
            {msg && (
              <p className={`text-sm ${msg.toLowerCase().includes("success") || msg.toLowerCase().includes("berhasil") ? "text-emerald-700" : "text-rose-600"}`}>
                {msg}
              </p>
            )}
          </div>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs uppercase tracking-wide text-emerald-700">{locale === "en" ? "Active Accounts" : "Akun Aktif"}</p>
            <p className="mt-1 text-xl font-semibold text-emerald-900">{summary.active}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-600">{locale === "en" ? "Total Accounts" : "Total Akun"}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{summary.total}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Code" : "Kode"}</th>
                <th className="p-3">{locale === "en" ? "Name" : "Nama"}</th>
                <th className="p-3">{locale === "en" ? "Category" : "Kategori"}</th>
                <th className="p-3">{locale === "en" ? "Status" : "Status"}</th>
                <th className="p-3">{locale === "en" ? "Action" : "Aksi"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {chartOfAccounts.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={5}>{locale === "en" ? "No COA data yet." : "Belum ada data COA."}</td>
                </tr>
              ) : (
                chartOfAccounts.map((account) => (
                  <tr key={account.id} className="border-b border-slate-100">
                    <td className="p-3 font-medium text-slate-900">{account.code}</td>
                    <td className="p-3">{account.name}</td>
                    <td className="p-3 capitalize">{account.category}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${account.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {account.is_active ? (locale === "en" ? "Active" : "Aktif") : (locale === "en" ? "Inactive" : "Tidak Aktif")}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button type="button" onClick={() => toggleChartOfAccount(account.id)} className="px-3 py-1.5 text-xs">
                        {account.is_active ? (locale === "en" ? "Deactivate" : "Nonaktifkan") : (locale === "en" ? "Activate" : "Aktifkan")}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
