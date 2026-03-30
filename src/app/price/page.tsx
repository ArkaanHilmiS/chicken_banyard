"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useOfflineStore } from "@/lib/offlineStore";

export default function PricePage() {
  const prices = useOfflineStore((state) => state.prices);
  const addPrice = useOfflineStore((state) => state.addPrice);
  const [pricePerKg, setPricePerKg] = useState("");
  const [msg, setMsg] = useState("");

  const handleAddPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricePerKg) {
      setMsg("Harga per kg wajib diisi.");
      return;
    }

    addPrice(Number(pricePerKg));
    setMsg("Harga berhasil ditambahkan.");
    setPricePerKg("");
  };

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pricing Table</h1>
          <p className="mt-1 text-sm text-slate-600">Input harga telur per kg secara manual.</p>
        </div>
      </div>

      <form onSubmit={handleAddPrice} className="mb-4 flex flex-wrap items-center gap-3">
        <Input type="number" min={1} value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} placeholder="Harga / Kg" className="w-full max-w-xs" required />
        <Button type="submit">+ Tambah Harga</Button>
      </form>

      {msg && <p className="mb-4 text-sm text-emerald-700">{msg}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Harga / Kg</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {prices.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="p-3">{p.price_date}</td>
                <td className="p-3 font-medium">{p.price_per_kg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
