"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { GoodsReceipt } from "@/types/goodsReceipt";

export default function GoodsReceiptPage() {
  const receipts = useOfflineStore((state) => state.goodsReceipts);
  const purchases = useOfflineStore((state) => state.purchases);
  const parties = useOfflineStore((state) => state.masterParties);
  const items = useOfflineStore((state) => state.itemMasters);
  const uoms = useOfflineStore((state) => state.unitOfMeasures);
  const warehouses = useOfflineStore((state) => state.warehouses);
  const addGoodsReceipt = useOfflineStore((state) => state.addGoodsReceipt);
  const [purchaseId, setPurchaseId] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [itemName, setItemName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");
  const [unit, setUnit] = useState("sak");
  const [warehouseId, setWarehouseId] = useState("");
  const [condition, setCondition] = useState<GoodsReceipt["condition"] | "">("");
  const [msg, setMsg] = useState("");

  const vendorOptions = useMemo(
    () => parties
      .filter((party) => party.party_type === "vendor" || party.party_type === "supplier")
      .map((party) => ({ value: party.id, label: party.name })),
    [parties],
  );

  const itemOptions = useMemo(
    () => items.map((item) => ({ value: item.id, label: `${item.sku} - ${item.name}` })),
    [items],
  );

  const unitOptions = useMemo(
    () => uoms.map((uom) => ({ value: uom.symbol, label: `${uom.name} (${uom.symbol})` })),
    [uoms],
  );

  const conditionOptions = [
    { value: "good", label: "Good" },
    { value: "partial", label: "Partial" },
    { value: "damaged", label: "Damaged" },
  ];

  const warehouseOptions = useMemo(
    () => warehouses
      .filter((warehouse) => warehouse.is_active)
      .map((warehouse) => ({ value: warehouse.id, label: `${warehouse.code} - ${warehouse.name}` })),
    [warehouses],
  );

  const pendingPurchaseOptions = useMemo(
    () => purchases
      .filter((purchase) => purchase.payment_status !== "paid")
      .map((purchase) => ({
        value: purchase.id,
        label: `${purchase.id} - ${purchase.vendor_name} - ${purchase.item_name}`,
      })),
    [purchases],
  );

  const onPurchaseChange = (value: string) => {
    setPurchaseId(value);
    const purchase = purchases.find((row) => row.id === value);
    if (!purchase) return;

    setVendorName(purchase.vendor_name);
    setItemName(purchase.item_name);
    setQuantityReceived(String(purchase.quantity));
    setUnit(purchase.unit);
    setWarehouseId("WH-002");
    setCondition("good");

    const selectedVendor = parties.find((party) => party.name.toLowerCase() === purchase.vendor_name.toLowerCase());
    setVendorId(selectedVendor?.id || "");
    const selectedItem = items.find((item) => item.name.toLowerCase() === purchase.item_name.toLowerCase());
    setItemId(selectedItem?.id || "");
  };

  const onVendorChange = (value: string) => {
    setVendorId(value);
    const selectedVendor = parties.find((party) => party.id === value);
    setVendorName(selectedVendor?.name || "");
  };

  const onItemChange = (value: string) => {
    setItemId(value);
    const selectedItem = items.find((item) => item.id === value);
    if (!selectedItem) return;

    setItemName(selectedItem.name);
    setUnit(selectedItem.default_uom);
  };

  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !itemId || !itemName || !quantityReceived || !unit || !warehouseId || !condition) {
      setMsg("Semua field wajib diisi.");
      return;
    }

    addGoodsReceipt({
      purchaseId: purchaseId || undefined,
      vendorName,
      itemId,
      itemName,
      quantityReceived: Number(quantityReceived),
      unit,
      warehouseId,
      condition,
    });

    setMsg("Goods receipt berhasil ditambahkan.");
    setVendorName("");
    setItemName("");
    setPurchaseId("");
    setVendorId("");
    setItemId("");
    setQuantityReceived("");
    setUnit("sak");
    setWarehouseId("");
    setCondition("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleAddReceipt} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Goods Receipt</h1>
            <p className="mt-1 text-sm text-slate-600">Penerimaan barang terintegrasi dengan purchase order, master vendor/supplier, item, unit, dan stok.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Select options={pendingPurchaseOptions} value={purchaseId} onChange={(e) => onPurchaseChange(e.target.value)} className="w-full" />
            <Select options={vendorOptions} value={vendorId} onChange={(e) => onVendorChange(e.target.value)} required className="w-full" />
            <Select options={itemOptions} value={itemId} onChange={(e) => onItemChange(e.target.value)} required className="w-full" />
            <Input type="number" min={1} value={quantityReceived} onChange={(e) => setQuantityReceived(e.target.value)} placeholder="Qty Diterima" className="w-full" required />
            <Select options={unitOptions} value={unit} onChange={(e) => setUnit(e.target.value)} required className="w-full" />
            <Select options={warehouseOptions} value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required className="w-full" />
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
                <th className="p-3">PO</th>
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
                  <td className="p-3 text-slate-500" colSpan={7}>Belum ada data goods receipt.</td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="p-3">{r.receipt_date}</td>
                    <td className="p-3">{r.purchase_id || "-"}</td>
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