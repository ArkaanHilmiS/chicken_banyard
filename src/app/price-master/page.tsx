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

  const [itemId, setItemId] = useState("");
  const [uom, setUom] = useState("");
  const [priceType, setPriceType] = useState<PriceMaster["price_type"] | "">("");
  const [priceValue, setPriceValue] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "">("");
  const [transactionMethod, setTransactionMethod] = useState<"cash-in" | "cash-out" | "transfer" | "hybrid" | "">("");
  const [msg, setMsg] = useState("");

  const itemOptions = items.map((item) => ({ value: item.id, label: `${item.sku} - ${item.name}` }));
  const uomOptions = uoms.map((uomRow) => ({ value: uomRow.symbol, label: `${uomRow.name} (${uomRow.symbol})` }));

  const priceTypeOptions = [
    { value: "purchase", label: "Purchase" },
    { value: "selling", label: "Selling" },
    { value: "wholesale", label: "Wholesale" },
    { value: "retail", label: "Retail" },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: "Cash" },
    { value: "qris", label: "QRIS" },
  ];

  const transactionMethodOptions = [
    { value: "cash-in", label: "Cash In" },
    { value: "cash-out", label: "Cash Out" },
    { value: "transfer", label: "Transfer" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId || !uom || !priceType || !priceValue || !effectiveDate) {
      setMsg("Field item, UoM, tipe harga, nilai harga, dan tanggal efektif wajib diisi.");
      return;
    }

    const selectedItem = items.find((item) => item.id === itemId);
    if (!selectedItem) {
      setMsg("Item tidak ditemukan.");
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

    setMsg("Price master berhasil ditambahkan.");
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
        <h1 className="text-xl font-semibold text-slate-900">Price Master Data</h1>
        <p className="mt-1 text-sm text-slate-600">Kelola harga purchase/selling/wholesale/retail per item dan unit.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select options={itemOptions} value={itemId} onChange={(e) => setItemId(e.target.value)} required className="w-full" />
            <Select options={uomOptions} value={uom} onChange={(e) => setUom(e.target.value)} required className="w-full" />
            <Select options={priceTypeOptions} value={priceType} onChange={(e) => setPriceType(e.target.value as PriceMaster["price_type"] | "")} required className="w-full" />
            <Input type="number" min={0} value={priceValue} onChange={(e) => setPriceValue(e.target.value)} placeholder="Nilai harga" className="w-full" required />
            <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="w-full" required />
            <Select options={paymentMethodOptions} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as "cash" | "qris" | "")} className="w-full" />
            <Select options={transactionMethodOptions} value={transactionMethod} onChange={(e) => setTransactionMethod(e.target.value as "cash-in" | "cash-out" | "transfer" | "hybrid" | "")} className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Tambah Price Master</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Item</th>
                <th className="p-3">UoM</th>
                <th className="p-3">Tipe Harga</th>
                <th className="p-3">Nilai</th>
                <th className="p-3">Tanggal Efektif</th>
                <th className="p-3">Metode Bayar</th>
                <th className="p-3">Metode Transaksi</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {priceMasters.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={7}>Belum ada data price master.</td>
                </tr>
              ) : (
                priceMasters.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="p-3">{row.item_name}</td>
                    <td className="p-3">{row.uom}</td>
                    <td className="p-3 capitalize">{row.price_type}</td>
                    <td className="p-3">{row.price_value.toLocaleString("id-ID")}</td>
                    <td className="p-3">{row.effective_date}</td>
                    <td className="p-3 uppercase">{row.payment_method || "-"}</td>
                    <td className="p-3">{row.transaction_method || "-"}</td>
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
