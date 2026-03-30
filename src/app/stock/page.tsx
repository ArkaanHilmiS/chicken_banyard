"use client";
import { useOfflineStore } from "@/lib/offlineStore";

export default function StockPage() {
  const stocks = useOfflineStore((state) => state.stocks);
  const addStock = useOfflineStore((state) => state.addStock);

  const handleAddStock = () => {
    addStock({ quantityKg: 50, stockType: "incoming" });
  };

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Inventory Management</h1>
        <button onClick={handleAddStock} className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Tambah Stock</button>
      </div>
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
