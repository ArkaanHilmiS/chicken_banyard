"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { nextSequenceNumber, useOfflineStore } from "@/lib/offlineStore";
import type { Purchase } from "@/types/purchase";

export default function ProcurementPage() {
  const purchases = useOfflineStore((state) => state.purchases);
  const parties = useOfflineStore((state) => state.masterParties);
  const items = useOfflineStore((state) => state.itemMasters);
  const uoms = useOfflineStore((state) => state.unitOfMeasures);
  const priceMasters = useOfflineStore((state) => state.priceMasters);
  const addPurchase = useOfflineStore((state) => state.addPurchase);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";
  const nextPoNumber = useMemo(() => nextSequenceNumber("PO", purchases), [purchases]);
  const [vendorName, setVendorName] = useState("");
  const [itemName, setItemName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("paket");
  const [unitPrice, setUnitPrice] = useState("");
  const [category, setCategory] = useState<Purchase["category"] | "">("");
  const [msg, setMsg] = useState("");

  const vendorOptions = useMemo(
    () => parties
      .filter((party) => party.is_active && (party.party_type === "vendor" || party.party_type === "supplier"))
      .map((party) => ({ value: party.id, label: party.name })),
    [parties],
  );

  const itemOptions = useMemo(
    () => items
      .filter((item) => item.is_active)
      .map((item) => ({ value: item.id, label: `${item.sku} - ${item.name}` })),
    [items],
  );

  const unitOptions = useMemo(
    () => uoms
      .filter((uom) => uom.is_active)
      .map((uom) => ({ value: uom.symbol, label: `${uom.name} (${uom.symbol})` })),
    [uoms],
  );

  const categoryOptions = [
    { value: "utility", label: locale === "en" ? "Utility" : "Utility" },
    { value: "feed", label: locale === "en" ? "Feed" : "Pakan" },
    { value: "livestock", label: locale === "en" ? "Livestock" : "Ternak" },
    { value: "operational", label: locale === "en" ? "Operational" : "Operasional" },
    { value: "asset", label: locale === "en" ? "Asset" : "Aset" },
    { value: "other", label: locale === "en" ? "Other" : "Lainnya" },
  ];

  const paymentStatusLabel = (value: string) => {
    if (value === "paid") return locale === "en" ? "Paid" : "Lunas";
    if (value === "partial") return locale === "en" ? "Partial" : "Parsial";
    return locale === "en" ? "Pending" : "Pending";
  };

  const inferCategoryFromItem = (itemCategory: string): Purchase["category"] => {
    const normalized = itemCategory.toLowerCase();
    if (normalized.includes("pakan") || normalized.includes("feed")) return "feed";
    if (normalized.includes("ayam") || normalized.includes("livestock")) return "livestock";
    if (normalized.includes("utility") || normalized.includes("listrik") || normalized.includes("air")) return "utility";
    if (normalized.includes("asset")) return "asset";
    if (normalized.includes("operasional")) return "operational";
    return "other";
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
    setCategory(inferCategoryFromItem(selectedItem.category));

    const matchedPurchasePrice = priceMasters.find(
      (row) => row.item_id === selectedItem.id && row.price_type === "purchase",
    );
    setUnitPrice(String(matchedPurchasePrice?.price_value ?? selectedItem.purchase_price));
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !itemId || !itemName || !quantity || !unit || !unitPrice || !category) {
      setMsg(locale === "en" ? "All fields are required." : "Semua field wajib diisi.");
      return;
    }

    addPurchase({
      vendorName,
      itemId,
      itemName,
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
      category,
    });

    setMsg(locale === "en" ? "Purchase added successfully." : "Data pembelian berhasil ditambahkan.");
    setVendorName("");
    setItemName("");
    setVendorId("");
    setItemId("");
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
            <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Procurement" : "Pengadaan"}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "en"
                ? "Manage farm purchases integrated with vendor/supplier master data, items, units, and price master."
                : "Kelola pembelian kebutuhan farm terintegrasi dengan master data vendor/supplier, item, unit, dan harga master."}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "PO Number" : "No. PO"}</label>
              <Input
                type="text"
                value={nextPoNumber}
                readOnly
                className="w-full bg-slate-50 text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Vendor" : "Vendor"}</label>
              <Select options={vendorOptions} value={vendorId} onChange={(e) => onVendorChange(e.target.value)} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Item" : "Item"}</label>
              <Select options={itemOptions} value={itemId} onChange={(e) => onItemChange(e.target.value)} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Quantity" : "Qty"}</label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={locale === "en" ? "Quantity" : "Qty"} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Unit" : "Unit"}</label>
              <Select options={unitOptions} value={unit} onChange={(e) => setUnit(e.target.value)} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Unit Price" : "Harga Satuan"}</label>
              <Input type="number" min={1} value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder={locale === "en" ? "Unit Price" : "Harga Satuan"} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Category" : "Kategori"}</label>
              <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value as Purchase["category"] | "")} required className="w-full" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{locale === "en" ? "+ Create Purchase" : "+ Buat Purchase"}</Button>
            {msg && (
              <p className={`text-sm ${msg.toLowerCase().includes("success") || msg.toLowerCase().includes("berhasil") ? "text-emerald-700" : "text-rose-600"}`}>
                {msg}
              </p>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Date" : "Tanggal"}</th>
                <th className="p-3">{locale === "en" ? "PO No" : "No. PO"}</th>
                <th className="p-3">{locale === "en" ? "Vendor" : "Vendor"}</th>
                <th className="p-3">{locale === "en" ? "Item" : "Item"}</th>
                <th className="p-3">{locale === "en" ? "Qty" : "Qty"}</th>
                <th className="p-3">{locale === "en" ? "Category" : "Kategori"}</th>
                <th className="p-3">{locale === "en" ? "Total" : "Total"}</th>
                <th className="p-3">{locale === "en" ? "Status" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {purchases.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={8}>{locale === "en" ? "No purchases yet." : "Belum ada data pembelian."}</td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="p-3">{p.purchase_date}</td>
                    <td className="p-3 font-medium text-slate-900">{p.po_number || "-"}</td>
                    <td className="p-3">{p.vendor_name}</td>
                    <td className="p-3">{p.item_name}</td>
                    <td className="p-3">{p.quantity} {p.unit}</td>
                    <td className="p-3 capitalize">{categoryOptions.find((option) => option.value === p.category)?.label ?? p.category}</td>
                    <td className="p-3">{p.total_price.toLocaleString(numberLocale)}</td>
                    <td className="p-3">{paymentStatusLabel(p.payment_status)}</td>
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
