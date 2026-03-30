"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Stock } from "@/types/stock";

export default function StockPage() {
  const stocks = useOfflineStore((state) => state.stocks);
  const addStock = useOfflineStore((state) => state.addStock);
  const [quantityKg, setQuantityKg] = useState("");
  const [stockType, setStockType] = useState<Stock["stock_type"] | "">("");
  const [orderId, setOrderId] = useState("");
  const [msg, setMsg] = useState("");

  const stockTypeOptions = [
    { value: "incoming", label: "Incoming" },
    { value: "outgoing", label: "Outgoing" },
    { value: "adjustment", label: "Adjustment" },
  ];

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantityKg || !stockType) {
      setMsg("Qty dan jenis stok wajib diisi.");
      return;
    }

    addStock({ quantityKg: Number(quantityKg), stockType, orderId: orderId || undefined });
    setMsg("Stok berhasil ditambahkan.");
    setQuantityKg("");
    setStockType("");
    setOrderId("");
  };

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-slate-600">Input stok masuk, keluar, atau adjustment secara manual.</p>
        </div>
      </div>

      <form onSubmit={handleAddStock} className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input type="number" min={1} value={quantityKg} onChange={(e) => setQuantityKg(e.target.value)} placeholder="Jumlah (Kg)" className="w-full" required />
        <Select options={stockTypeOptions} value={stockType} onChange={(e) => setStockType(e.target.value as Stock["stock_type"] | "")} required className="w-full" />
        <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID (opsional)" className="w-full" />
        <Button type="submit">+ Tambah Stock</Button>
      </form>

      {msg && <p className="mb-4 text-sm text-emerald-700">{msg}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Jumlah (Kg)</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">Order</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {stocks.map((s) => (
              <tr key={s.id} className="border-b border-slate-100">
                <td className="p-3">{s.stock_date}</td>
                <td className="p-3">{s.quantity_kg}</td>
                <td className="p-3 capitalize">{s.stock_type}</td>
                <td className="p-3">{s.order_id || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
