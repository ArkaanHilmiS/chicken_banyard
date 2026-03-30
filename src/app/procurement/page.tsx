"use client";

import { useOfflineStore } from "@/lib/offlineStore";

export default function ProcurementPage() {
  const purchases = useOfflineStore((state) => state.purchases);
  const addPurchase = useOfflineStore((state) => state.addPurchase);

  const handleAddPurchase = () => {
    addPurchase({
      vendorName: "Vendor Operasional",
      itemName: "Tagihan Air",
      quantity: 1,
      unit: "paket",
      unitPrice: 450000,
      category: "utility",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Procurement</h1>
            <p className="mt-1 text-sm text-slate-600">Kelola pembelian kebutuhan farm secara offline sementara (tanpa database).</p>
          </div>
          <button onClick={handleAddPurchase} className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Buat Purchase</button>
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