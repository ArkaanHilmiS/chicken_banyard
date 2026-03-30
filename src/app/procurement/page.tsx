"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Purchase } from "@/types/purchase";

export default function ProcurementPage() {
  const purchases = useOfflineStore((state) => state.purchases);
  const addPurchase = useOfflineStore((state) => state.addPurchase);
  const [vendorName, setVendorName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("paket");
  const [unitPrice, setUnitPrice] = useState("");
  const [category, setCategory] = useState<Purchase["category"] | "">("");
  const [msg, setMsg] = useState("");

  const categoryOptions = [
    { value: "utility", label: "Utility" },
    { value: "feed", label: "Feed" },
    { value: "livestock", label: "Livestock" },
    { value: "operational", label: "Operational" },
    { value: "asset", label: "Asset" },
    { value: "other", label: "Other" },
  ];

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !itemName || !quantity || !unit || !unitPrice || !category) {
      setMsg("Semua field wajib diisi.");
      return;
    }

    addPurchase({
      vendorName,
      itemName,
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
      category,
    });

    setMsg("Data pembelian berhasil ditambahkan.");
    setVendorName("");
    setItemName("");
    setQuantity("");
    setUnit("paket");
    setUnitPrice("");
    setCategory("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleAddPurchase} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Procurement</h1>
            <p className="mt-1 text-sm text-slate-600">Kelola pembelian kebutuhan farm secara offline sementara (tanpa database).</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="Vendor" className="w-full" required />
            <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item" className="w-full" required />
            <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Qty" className="w-full" required />
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit (kg/sak/paket)" className="w-full" required />
            <Input type="number" min={1} value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="Unit Price" className="w-full" required />
            <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as Purchase["category"] | "")} required className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Buat Purchase</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Item</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {purchases.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={7}>Belum ada data pembelian.</td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="p-3">{p.purchase_date}</td>
                    <td className="p-3">{p.vendor_name}</td>
                    <td className="p-3">{p.item_name}</td>
                    <td className="p-3">{p.quantity} {p.unit}</td>
                    <td className="p-3 capitalize">{p.category}</td>
                    <td className="p-3">{p.total_price}</td>
                    <td className="p-3 capitalize">{p.payment_status}</td>
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