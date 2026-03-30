"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useOfflineStore } from "@/lib/offlineStore";

export default function UomMasterPage() {
  const uoms = useOfflineStore((state) => state.unitOfMeasures);
  const addUnitOfMeasure = useOfflineStore((state) => state.addUnitOfMeasure);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol) {
      setMsg("Nama dan simbol UoM wajib diisi.");
      return;
    }

    addUnitOfMeasure({
      name,
      symbol,
      description: description || undefined,
    });

    setMsg("Unit of Measure berhasil ditambahkan.");
    setName("");
    setSymbol("");
    setDescription("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Unit of Measure Master Data</h1>
        <p className="mt-1 text-sm text-slate-600">Kelola satuan unit seperti kg, sak, paket, liter, dan lainnya.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama UoM" className="w-full" required />
            <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Simbol (kg/sak/ltr)" className="w-full" required />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi" className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Tambah UoM</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Simbol</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {uoms.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={4}>Belum ada data UoM.</td>
                </tr>
              ) : (
                uoms.map((uom) => (
                  <tr key={uom.id} className="border-b border-slate-100">
                    <td className="p-3">{uom.name}</td>
                    <td className="p-3">{uom.symbol}</td>
                    <td className="p-3">{uom.description || "-"}</td>
                    <td className="p-3">{uom.is_active ? "Active" : "Inactive"}</td>
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
