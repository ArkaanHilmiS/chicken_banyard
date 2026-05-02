"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { PriceMaster } from "@/types/priceMaster";

export default function PriceMasterPage() {
  const items = useOfflineStore((state) => state.itemMasters);
  const uoms = useOfflineStore((state) => state.unitOfMeasures);
  const priceMasters = useOfflineStore((state) => state.priceMasters);
  const addPriceMaster = useOfflineStore((state) => state.addPriceMaster);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";

  const [itemId, setItemId] = useState("");
  const [uom, setUom] = useState("");
  const [priceType, setPriceType] = useState<PriceMaster["price_type"] | "">("");
  const [priceValue, setPriceValue] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "">("");
  const [transactionMethod, setTransactionMethod] = useState<"cash-in" | "cash-out" | "transfer" | "hybrid" | "">("");
  const [msg, setMsg] = useState("");

  const itemOptions = items
    .filter((item) => item.is_active)
    .map((item) => ({ value: item.id, label: `${item.sku} - ${item.name}` }));
  const uomOptions = uoms
    .filter((uomRow) => uomRow.is_active)
    .map((uomRow) => ({ value: uomRow.symbol, label: `${uomRow.name} (${uomRow.symbol})` }));

  const priceTypeOptions = [
    { value: "purchase", label: locale === "en" ? "Purchase" : "Purchase" },
    { value: "selling", label: locale === "en" ? "Selling" : "Selling" },
    { value: "wholesale", label: locale === "en" ? "Wholesale" : "Grosir" },
    { value: "retail", label: locale === "en" ? "Retail" : "Retail" },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: locale === "en" ? "Cash" : "Tunai" },
    { value: "qris", label: "QRIS" },
  ];

  const transactionMethodOptions = [
    { value: "cash-in", label: locale === "en" ? "Cash In" : "Cash In" },
    { value: "cash-out", label: locale === "en" ? "Cash Out" : "Cash Out" },
    { value: "transfer", label: locale === "en" ? "Transfer" : "Transfer" },
    { value: "hybrid", label: locale === "en" ? "Hybrid" : "Hybrid" },
  ];

  const priceTypeLabel = (value: PriceMaster["price_type"]) => {
    const match = priceTypeOptions.find((option) => option.value === value);
    return match?.label ?? value;
  };

  const paymentMethodLabel = (value?: "cash" | "qris") => {
    const match = paymentMethodOptions.find((option) => option.value === value);
    return match?.label ?? "-";
  };

  const transactionMethodLabel = (value?: "cash-in" | "cash-out" | "transfer" | "hybrid") => {
    const match = transactionMethodOptions.find((option) => option.value === value);
    return match?.label ?? "-";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !uom || !priceType || !priceValue || !effectiveDate) {
      setMsg(locale === "en"
        ? "Item, UoM, price type, price value, and effective date are required."
        : "Field item, UoM, tipe harga, nilai harga, dan tanggal efektif wajib diisi.");
      return;
    }

    const selectedItem = items.find((item) => item.id === itemId);
    if (!selectedItem || !selectedItem.is_active) {
      setMsg(locale === "en" ? "Active item not found." : "Item aktif tidak ditemukan.");
      return;
    }

    addPriceMaster({
      itemId,
      itemName: selectedItem.name,
      uom,
      priceType,
      priceValue: Number(priceValue),
      effectiveDate,
      paymentMethod: paymentMethod || undefined,
      transactionMethod: transactionMethod || undefined,
    });

    setMsg(locale === "en" ? "Price master added successfully." : "Price master berhasil ditambahkan.");
    setItemId("");
    setUom("");
    setPriceType("");
    setPriceValue("");
    setEffectiveDate(new Date().toISOString().slice(0, 10));
    setPaymentMethod("");
    setTransactionMethod("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Price Master Data" : "Master Data Price"}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en"
            ? "Manage purchase/selling/wholesale/retail prices per item and unit."
            : "Kelola harga purchase/selling/wholesale/retail per item dan unit."}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select options={itemOptions} value={itemId} onChange={(e) => setItemId(e.target.value)} required className="w-full" />
            <Select options={uomOptions} value={uom} onChange={(e) => setUom(e.target.value)} required className="w-full" />
            <Select options={priceTypeOptions} value={priceType} onChange={(e) => setPriceType(e.target.value as PriceMaster["price_type"] | "")} required className="w-full" />
            <Input type="number" min={0} value={priceValue} onChange={(e) => setPriceValue(e.target.value)} placeholder={locale === "en" ? "Price value" : "Nilai harga"} className="w-full" required />
            <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full" required />
            <Select options={paymentMethodOptions} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as "cash" | "qris" | "")} className="w-full" />
            <Select options={transactionMethodOptions} value={transactionMethod} onChange={(e) => setTransactionMethod(e.target.value as "cash-in" | "cash-out" | "transfer" | "hybrid" | "")} className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{locale === "en" ? "+ Add Price Master" : "+ Tambah Price Master"}</Button>
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
                <th className="p-3">{locale === "en" ? "Item" : "Item"}</th>
                <th className="p-3">{locale === "en" ? "UoM" : "UoM"}</th>
                <th className="p-3">{locale === "en" ? "Price Type" : "Tipe Harga"}</th>
                <th className="p-3">{locale === "en" ? "Value" : "Nilai"}</th>
                <th className="p-3">{locale === "en" ? "Effective Date" : "Tanggal Efektif"}</th>
                <th className="p-3">{locale === "en" ? "Payment Method" : "Metode Bayar"}</th>
                <th className="p-3">{locale === "en" ? "Transaction Method" : "Metode Transaksi"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {priceMasters.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={7}>{locale === "en" ? "No price master data yet." : "Belum ada data price master."}</td>
                </tr>
              ) : (
                priceMasters.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="p-3">{row.item_name}</td>
                    <td className="p-3">{row.uom}</td>
                    <td className="p-3">{priceTypeLabel(row.price_type)}</td>
                    <td className="p-3">{row.price_value.toLocaleString(numberLocale)}</td>
                    <td className="p-3">{row.effective_date}</td>
                    <td className="p-3">{paymentMethodLabel(row.payment_method)}</td>
                    <td className="p-3">{transactionMethodLabel(row.transaction_method)}</td>
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
