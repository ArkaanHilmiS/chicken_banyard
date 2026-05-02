"use client";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Stock } from "@/types/stock";

export default function StockPage() {
  const stocks = useOfflineStore((state) => state.stocks);
  const items = useOfflineStore((state) => state.itemMasters);
  const warehouses = useOfflineStore((state) => state.warehouses);
  const addStock = useOfflineStore((state) => state.addStock);
  const [itemId, setItemId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockType, setStockType] = useState<Stock["stock_type"] | "">("");
  const [orderId, setOrderId] = useState("");
  const [msg, setMsg] = useState("");

  const stockTypeOptions = [
    { value: "incoming", label: "Incoming" },
    { value: "outgoing", label: "Outgoing" },
    { value: "adjustment", label: "Adjustment" },
  ];

  const itemOptions = useMemo(
    () => items
      .filter((item) => item.is_active)
      .map((item) => ({ value: item.id, label: `${item.sku} - ${item.name}` })),
    [items],
  );

  const warehouseOptions = useMemo(
    () => warehouses
      .filter((warehouse) => warehouse.is_active)
      .map((warehouse) => ({ value: warehouse.id, label: `${warehouse.code} - ${warehouse.name}` })),
    [warehouses],
  );

  const inventorySummary = useMemo(() => {
    const summary = new Map<string, { itemName: string; warehouseName: string; unit: string; balance: number }>();
    for (const row of stocks) {
      const key = `${row.item_id}::${row.warehouse_id}`;
      const current = summary.get(key) || {
        itemName: row.item_name,
        warehouseName: row.warehouse_name,
        unit: row.unit,
        balance: 0,
      };

      const signedQty = row.stock_type === "outgoing" ? -row.quantity : row.quantity;
      current.balance += signedQty;
      summary.set(key, current);
    }

    return Array.from(summary.values()).sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [stocks]);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !warehouseId || !quantity || !stockType) {
      setMsg("Item, gudang, qty, dan jenis stok wajib diisi.");
      return;
    }

    addStock({ itemId, warehouseId, quantity: Number(quantity), stockType, orderId: orderId || undefined });
    setMsg("Stok berhasil ditambahkan.");
    setItemId("");
    setWarehouseId("");
    setQuantity("");
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

      <form onSubmit={handleAddStock} className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Select options={itemOptions} value={itemId} onChange={(e) => setItemId(e.target.value)} required className="w-full" />
        <Select options={warehouseOptions} value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required className="w-full" />
        <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Jumlah" className="w-full" required />
        <Select options={stockTypeOptions} value={stockType} onChange={(e) => setStockType(e.target.value as Stock["stock_type"] | "")} required className="w-full" />
        <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID (opsional)" className="w-full" />
        <Button type="submit">+ Tambah Stock</Button>
      </form>

      {msg && <p className="mb-4 text-sm text-emerald-700">{msg}</p>}

      <section className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Ringkasan Inventory per Item dan Gudang</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">Gudang</th>
                <th className="p-2">Stok</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {inventorySummary.map((row) => (
                <tr key={`${row.itemName}-${row.warehouseName}`} className="border-t border-slate-200">
                  <td className="p-2">{row.itemName}</td>
                  <td className="p-2">{row.warehouseName}</td>
                  <td className="p-2">{row.balance} {row.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Item</th>
              <th className="p-3">Gudang</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">Order</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {stocks.map((s) => (
              <tr key={s.id} className="border-b border-slate-100">
                <td className="p-3">{s.stock_date}</td>
                <td className="p-3">{s.item_name}</td>
                <td className="p-3">{s.warehouse_name}</td>
                <td className="p-3">{s.quantity} {s.unit}</td>
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
