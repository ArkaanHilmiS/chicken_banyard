"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";

export default function ItemMasterPage() {
  const items = useOfflineStore((state) => state.itemMasters);
  const uoms = useOfflineStore((state) => state.unitOfMeasures);
  const addItemMaster = useOfflineStore((state) => state.addItemMaster);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [defaultUom, setDefaultUom] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const uomOptions = uoms.map((uom) => ({ value: uom.symbol, label: `${uom.name} (${uom.symbol})` }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !category || !defaultUom || !purchasePrice || !sellingPrice || !minStock) {
      setMsg("Semua field wajib diisi kecuali deskripsi.");
      return;
    }

    addItemMaster({
      sku,
      name,
      category,
      defaultUom,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      minStock: Number(minStock),
      description: description || undefined,
    });

    setMsg("Item master berhasil ditambahkan.");
    setSku("");
    setName("");
    setCategory("");
    setDefaultUom("");
    setPurchasePrice("");
    setSellingPrice("");
    setMinStock("");
    setDescription("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Item Master Data</h1>
        <p className="mt-1 text-sm text-slate-600">Kelola item operasional, SKU, default unit, harga beli/jual, dan minimum stock.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" className="w-full" required />
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama item" className="w-full" required />
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori item" className="w-full" required />
            <Select options={uomOptions} value={defaultUom} onChange={(e) => setDefaultUom(e.target.value)} required className="w-full" />
            <Input type="number" min={0} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Harga beli" className="w-full" required />
            <Input type="number" min={0} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="Harga jual" className="w-full" required />
            <Input type="number" min={0} value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder="Minimum stock" className="w-full" required />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi" className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Tambah Item</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Nama Item</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">UoM</th>
                <th className="p-3">Harga Beli</th>
                <th className="p-3">Harga Jual</th>
                <th className="p-3">Min Stock</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={7}>Belum ada data item master.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="p-3">{item.sku}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.default_uom}</td>
                    <td className="p-3">{item.purchase_price.toLocaleString("id-ID")}</td>
                    <td className="p-3">{item.selling_price.toLocaleString("id-ID")}</td>
                    <td className="p-3">{item.min_stock}</td>
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
