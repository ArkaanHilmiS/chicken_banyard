"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { GoodsReceipt } from "@/types/goodsReceipt";

export default function GoodsReceiptPage() {
  const receipts = useOfflineStore((state) => state.goodsReceipts);
  const addGoodsReceipt = useOfflineStore((state) => state.addGoodsReceipt);
  const [vendorName, setVendorName] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");
  const [unit, setUnit] = useState("sak");
  const [condition, setCondition] = useState<GoodsReceipt["condition"] | "">("");
  const [msg, setMsg] = useState("");

  const conditionOptions = [
    { value: "good", label: "Good" },
    { value: "partial", label: "Partial" },
    { value: "damaged", label: "Damaged" },
  ];

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !itemName || !quantityReceived || !unit || !condition) {
      setMsg("Semua field wajib diisi.");
      return;
    }

    addGoodsReceipt({
      vendorName,
      itemName,
      quantityReceived: Number(quantityReceived),
      unit,
      condition,
    });

    setMsg("Goods receipt berhasil ditambahkan.");
    setVendorName("");
    setItemName("");
    setQuantityReceived("");
    setUnit("sak");
    setCondition("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleAddReceipt} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Goods Receipt</h1>
            <p className="mt-1 text-sm text-slate-600">Penerimaan barang sementara mode offline (tanpa database).</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} placeholder="Vendor" className="w-full" required />
            <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item" className="w-full" required />
            <Input type="number" min={1} value={quantityReceived} onChange={(e) => setQuantityReceived(e.target.value)} placeholder="Qty Diterima" className="w-full" required />
            <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unit" className="w-full" required />
            <Select options={conditionOptions} value={condition} onChange={(e) => setCondition(e.target.value as GoodsReceipt["condition"] | "")} required className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Buat GRN</Button>
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
                <th className="p-3">Qty Diterima</th>
                <th className="p-3">Kondisi</th>
                <th className="p-3">Gudang</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {receipts.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={6}>Belum ada data goods receipt.</td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="p-3">{r.receipt_date}</td>
                    <td className="p-3">{r.vendor_name}</td>
                    <td className="p-3">{r.item_name}</td>
                    <td className="p-3">{r.quantity_received} {r.unit}</td>
                    <td className="p-3 capitalize">{r.condition}</td>
                    <td className="p-3">{r.warehouse_location || "-"}</td>
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