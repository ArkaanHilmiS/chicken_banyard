"use client";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { Stock } from "@/types/stock";

export default function StockPage() {
  const stocks = useOfflineStore((state) => state.stocks);
  const orders = useOfflineStore((state) => state.orders);
  const purchases = useOfflineStore((state) => state.purchases);
  const goodsReceipts = useOfflineStore((state) => state.goodsReceipts);
  const items = useOfflineStore((state) => state.itemMasters);
  const warehouses = useOfflineStore((state) => state.warehouses);
  const addStock = useOfflineStore((state) => state.addStock);
  const locale = useOfflineStore((state) => state.locale);
  const [itemId, setItemId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockType, setStockType] = useState<Stock["stock_type"] | "">("");
  const [orderId, setOrderId] = useState("");
  const [msg, setMsg] = useState("");

  const stockTypeOptions = [
    { value: "incoming", label: locale === "en" ? "Incoming" : "Masuk" },
    { value: "outgoing", label: locale === "en" ? "Outgoing" : "Keluar" },
    { value: "adjustment", label: locale === "en" ? "Adjustment" : "Penyesuaian" },
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

  const receivedByPurchase = useMemo(() => {
    const summary = new Map<string, number>();
    for (const receipt of goodsReceipts) {
      if (!receipt.purchase_id) continue;
      summary.set(receipt.purchase_id, (summary.get(receipt.purchase_id) || 0) + receipt.quantity_received);
    }
    return summary;
  }, [goodsReceipts]);

  const committedByItem = useMemo(() => {
    const summary = new Map<string, number>();
    for (const order of orders) {
      if (order.order_status === "cancelled" || order.order_status === "delivered") continue;
      summary.set(order.item_id, (summary.get(order.item_id) || 0) + order.quantity);
    }
    return summary;
  }, [orders]);

  const orderedByItem = useMemo(() => {
    const summary = new Map<string, number>();
    for (const purchase of purchases) {
      const received = purchase.id ? receivedByPurchase.get(purchase.id) || 0 : 0;
      const remaining = Math.max(0, purchase.quantity - received);
      if (remaining <= 0) continue;
      summary.set(purchase.item_id, (summary.get(purchase.item_id) || 0) + remaining);
    }
    return summary;
  }, [purchases, receivedByPurchase]);

  const stockStatusSummary = useMemo(() => {
    const onHandByItem = new Map<string, { itemName: string; unit: string; onHand: number }>();
    for (const row of stocks) {
      const current = onHandByItem.get(row.item_id) || {
        itemName: row.item_name,
        unit: row.unit,
        onHand: 0,
      };
      const signedQty = row.stock_type === "outgoing" ? -row.quantity : row.quantity;
      current.onHand += signedQty;
      onHandByItem.set(row.item_id, current);
    }

    return items
      .filter((item) => item.is_active)
      .map((item) => {
        const onHand = onHandByItem.get(item.id)?.onHand ?? 0;
        const ordered = orderedByItem.get(item.id) || 0;
        const committed = committedByItem.get(item.id) || 0;
        const available = onHand - committed + ordered;
        const isLow = available < item.min_stock;

        return {
          itemName: item.name,
          unit: item.default_uom,
          inStock: onHand,
          ordered,
          committed,
          available,
          minStock: item.min_stock,
          isLow,
        };
      })
        .filter((row) => row.inStock !== 0 || row.ordered !== 0 || row.committed !== 0 || row.available !== 0)
      .sort((a, b) => a.itemName.localeCompare(b.itemName));
  }, [items, stocks, orderedByItem, committedByItem]);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !warehouseId || !quantity || !stockType) {
      setMsg(locale === "en" ? "Item, warehouse, qty, and stock type are required." : "Item, gudang, qty, dan jenis stok wajib diisi.");
      return;
    }

    addStock({ itemId, warehouseId, quantity: Number(quantity), stockType, orderId: orderId || undefined });
    setMsg(locale === "en" ? "Stock added successfully." : "Stok berhasil ditambahkan.");
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
          <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Inventory Management" : "Inventory Management"}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {locale === "en" ? "Record stock in, out, or adjustments manually." : "Input stok masuk, keluar, atau adjustment secara manual."}
          </p>
        </div>
      </div>

      <form onSubmit={handleAddStock} className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Item" : "Item"}</label>
          <Select options={itemOptions} value={itemId} onChange={(e) => setItemId(e.target.value)} required className="w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Warehouse" : "Gudang"}</label>
          <Select options={warehouseOptions} value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required className="w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Quantity" : "Jumlah"}</label>
          <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={locale === "en" ? "Quantity" : "Jumlah"} className="w-full" required />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Stock Type" : "Jenis Stok"}</label>
          <Select options={stockTypeOptions} value={stockType} onChange={(e) => setStockType(e.target.value as Stock["stock_type"] | "")} required className="w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Order ID" : "Order ID"}</label>
          <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder={locale === "en" ? "Order ID (optional)" : "Order ID (opsional)"} className="w-full" />
        </div>
        <Button type="submit">{locale === "en" ? "+ Add Stock" : "+ Tambah Stock"}</Button>
      </form>

      {msg && (
        <p className={`mb-4 text-sm ${msg.includes("berhasil") ? "text-emerald-700" : "text-rose-600"}`}>
          {msg}
        </p>
      )}

      <section className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-sm font-semibold text-slate-900">{locale === "en" ? "Stock Status Summary" : "Ringkasan Status Stok"}</h2>
        <p className="mt-1 text-xs text-slate-500">
          {locale === "en"
            ? "Available = In Stock - Committed + Ordered. Committed comes from sales orders not delivered. Ordered comes from PO not yet received."
            : "Available = In Stock - Committed + Ordered. Committed berasal dari sales order yang belum terkirim. Ordered berasal dari PO yang belum diterima."}
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-2">{locale === "en" ? "Item" : "Item"}</th>
                <th className="p-2">{locale === "en" ? "In Stock" : "In Stock"}</th>
                <th className="p-2">{locale === "en" ? "Committed" : "Committed"}</th>
                <th className="p-2">{locale === "en" ? "Ordered" : "Ordered"}</th>
                <th className="p-2">{locale === "en" ? "Available" : "Available"}</th>
                <th className="p-2">{locale === "en" ? "Min" : "Min"}</th>
                <th className="p-2">{locale === "en" ? "Status" : "Status"}</th>
                <th className="p-2">{locale === "en" ? "Unit" : "Unit"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {stockStatusSummary.length === 0 ? (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={8}>{locale === "en" ? "No stock movement yet." : "Belum ada pergerakan stok."}</td>
                </tr>
              ) : (
                stockStatusSummary.map((row) => (
                  <tr key={row.itemName} className={`border-t ${row.isLow ? "border-rose-200 bg-rose-50" : "border-slate-200"}`}>
                    <td className="p-2">{row.itemName}</td>
                    <td className="p-2">{row.inStock}</td>
                    <td className="p-2">{row.committed}</td>
                    <td className="p-2">{row.ordered}</td>
                    <td className="p-2">{row.available}</td>
                    <td className="p-2">{row.minStock}</td>
                    <td className="p-2">
                      <span className={row.isLow ? "font-semibold text-rose-700" : "text-emerald-700"}>
                        {row.isLow ? (locale === "en" ? "Below Min" : "Di bawah minimum") : (locale === "en" ? "OK" : "Aman")}
                      </span>
                    </td>
                    <td className="p-2">{row.unit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-900">{locale === "en" ? "Physical Balance by Item and Warehouse" : "Saldo Fisik per Item dan Gudang"}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-600">
              <tr>
                <th className="p-2">{locale === "en" ? "Item" : "Item"}</th>
                <th className="p-2">{locale === "en" ? "Warehouse" : "Gudang"}</th>
                <th className="p-2">{locale === "en" ? "Stock" : "Stok"}</th>
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
              <th className="p-3">{locale === "en" ? "Date" : "Tanggal"}</th>
              <th className="p-3">{locale === "en" ? "Item" : "Item"}</th>
              <th className="p-3">{locale === "en" ? "Warehouse" : "Gudang"}</th>
              <th className="p-3">{locale === "en" ? "Quantity" : "Jumlah"}</th>
              <th className="p-3">{locale === "en" ? "Type" : "Jenis"}</th>
              <th className="p-3">{locale === "en" ? "Order" : "Order"}</th>
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
