"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Journal } from "@/types/journal";

export default function JournalPage() {
  const journals = useOfflineStore((state) => state.journals);
  const addJournal = useOfflineStore((state) => state.addJournal);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Journal["category"] | "">("");
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");

  const operationalExpenseKeywords = ["listrik", "air", "pakan", "ayam", "operasional"];

  const categoryOptions = [
    { value: "pendapatan", label: "Pendapatan" },
    { value: "beban", label: "Beban" },
    { value: "aset", label: "Aset" },
    { value: "liabilitas", label: "Liabilitas" },
    { value: "modal", label: "Modal" },
  ];

  const typeOptions = [
    { value: "cash-in", label: "Cash In" },
    { value: "cash-out", label: "Cash Out" },
    { value: "adjustment", label: "Adjustment" },
  ];

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !type) {
      setMsg("Semua field wajib diisi.");
      return;
    }

    addJournal({
      description,
      amount: Number(amount),
      category,
      type,
    });

    setMsg("Jurnal berhasil ditambahkan.");
    setDescription("");
    setAmount("");
    setCategory("");
    setType("");
  };

  const expenseRows = journals.filter((j) => j.category === "beban");
  const operationalRows = journals.filter((j) => {
    const text = `${j.description} ${j.type}`.toLowerCase();
    return operationalExpenseKeywords.some((keyword) => text.includes(keyword));
  });

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleAddJournal} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Journal Ledger</h1>
            <p className="mt-1 text-sm text-slate-600">Pencatatan jurnal sementara berjalan di memory offline.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi transaksi" className="w-full" required />
            <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Nominal" className="w-full" required />
            <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as Journal["category"] | "")} required className="w-full" />
            <Select options={typeOptions} value={type} onChange={(e) => setType(e.target.value)} required className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Tambah Jurnal</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-600">Total Beban</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{expenseRows.length} entry</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">Operasional Utility dan Feed</p>
            <p className="mt-1 text-xl font-semibold text-amber-900">{operationalRows.length} entry</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Jenis Arus</th>
                <th className="p-3">Kategori Akun</th>
                <th className="p-3">Nominal</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {journals.map((j) => (
                <tr key={j.id} className="border-b border-slate-100">
                  <td className="p-3">{j.transaction_date}</td>
                  <td className="p-3">{j.description}</td>
                  <td className="p-3 capitalize">{j.type}</td>
                  <td className="p-3">{j.category}</td>
                  <td className="p-3">{j.amount}</td>
                  <td className="p-3">{j.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
