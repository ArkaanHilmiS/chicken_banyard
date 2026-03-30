"use client";

import { useOfflineStore } from "@/lib/offlineStore";

export default function GoodsReceiptPage() {
  const receipts = useOfflineStore((state) => state.goodsReceipts);
  const addGoodsReceipt = useOfflineStore((state) => state.addGoodsReceipt);

  const handleAddReceipt = () => {
    addGoodsReceipt({
      vendorName: "CV Pakan Jaya",
      itemName: "Pakan Layer",
      quantityReceived: 5,
      unit: "sak",
      condition: "good",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Goods Receipt</h1>
            <p className="mt-1 text-sm text-slate-600">Penerimaan barang sementara mode offline (tanpa database).</p>
          </div>
          <button onClick={handleAddReceipt} className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Buat GRN</button>
        </div>
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