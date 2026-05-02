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
  const toggleItemMaster = useOfflineStore((state) => state.toggleItemMaster);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [defaultUom, setDefaultUom] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [isActive, setIsActive] = useState("active");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const uomOptions = uoms
    .filter((uom) => uom.is_active)
    .map((uom) => ({ value: uom.symbol, label: `${uom.name} (${uom.symbol})` }));
  const categoryOptions = [
    { value: "Produk Utama", label: locale === "en" ? "Main Product" : "Produk Utama" },
    { value: "Bahan Baku", label: locale === "en" ? "Raw Material" : "Bahan Baku" },
    { value: "Utility", label: locale === "en" ? "Utility" : "Utility" },
    { value: "Operasional", label: locale === "en" ? "Operational" : "Operasional" },
    { value: "Aset", label: locale === "en" ? "Asset" : "Aset" },
    { value: "Lainnya", label: locale === "en" ? "Other" : "Lainnya" },
  ];
  const statusOptions = [
    { value: "active", label: locale === "en" ? "Active" : "Aktif" },
    { value: "inactive", label: locale === "en" ? "Inactive" : "Tidak Aktif" },
  ];

  const categoryLabel = (value: string) => categoryOptions.find((option) => option.value === value)?.label ?? value;

  const t = locale === "en"
    ? {
        title: "Item Master Data",
        description: "Manage operational items, SKUs, default units, purchase/sell prices, and minimum stock.",
        requiredMessage: "All fields are required except description.",
        successMessage: "Item master added successfully.",
        form: {
          sku: "SKU",
          name: "Item name",
          category: "Item category",
          uom: "Default UoM",
          purchasePrice: "Purchase price",
          sellingPrice: "Selling price",
          minStock: "Minimum stock",
          status: "Status",
          description: "Description",
          submit: "+ Add Item",
        },
        table: {
          empty: "No item master data yet.",
          sku: "SKU",
          name: "Item Name",
          category: "Category",
          uom: "UoM",
          purchasePrice: "Purchase Price",
          sellingPrice: "Selling Price",
          minStock: "Min Stock",
          status: "Status",
          action: "Action",
          activate: "Activate",
          deactivate: "Deactivate",
        },
      }
    : {
        title: "Item Master Data",
        description: "Kelola item operasional, SKU, default unit, harga beli/jual, dan minimum stock.",
        requiredMessage: "Semua field wajib diisi kecuali deskripsi.",
        successMessage: "Item master berhasil ditambahkan.",
        form: {
          sku: "SKU",
          name: "Nama item",
          category: "Kategori item",
          uom: "Default UoM",
          purchasePrice: "Harga beli",
          sellingPrice: "Harga jual",
          minStock: "Minimum stock",
          status: "Status",
          description: "Deskripsi",
          submit: "+ Tambah Item",
        },
        table: {
          empty: "Belum ada data item master.",
          sku: "SKU",
          name: "Nama Item",
          category: "Kategori",
          uom: "UoM",
          purchasePrice: "Harga Beli",
          sellingPrice: "Harga Jual",
          minStock: "Min Stock",
          status: "Status",
          action: "Aksi",
          activate: "Aktifkan",
          deactivate: "Nonaktifkan",
        },
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name || !category || !defaultUom || !purchasePrice || !sellingPrice || !minStock) {
      setMsg(t.requiredMessage);
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
      isActive: isActive === "active",
    });

    setMsg(t.successMessage);
    setSku("");
    setName("");
    setCategory("");
    setDefaultUom("");
    setPurchasePrice("");
    setSellingPrice("");
    setMinStock("");
    setIsActive("active");
    setDescription("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{t.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.description}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder={t.form.sku} className="w-full" required />
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.form.name} className="w-full" required />
            <Select options={categoryOptions} value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full" />
            <Select options={uomOptions} value={defaultUom} onChange={(e) => setDefaultUom(e.target.value)} required className="w-full" />
            <Input type="number" min={0} value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder={t.form.purchasePrice} className="w-full" required />
            <Input type="number" min={0} value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder={t.form.sellingPrice} className="w-full" required />
            <Input type="number" min={0} value={minStock} onChange={(e) => setMinStock(e.target.value)} placeholder={t.form.minStock} className="w-full" required />
            <Select options={statusOptions} value={isActive} onChange={(e) => setIsActive(e.target.value)} required className="w-full" />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.form.description} className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{t.form.submit}</Button>
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
                <th className="p-3">{t.table.sku}</th>
                <th className="p-3">{t.table.name}</th>
                <th className="p-3">{t.table.category}</th>
                <th className="p-3">{t.table.uom}</th>
                <th className="p-3">{t.table.purchasePrice}</th>
                <th className="p-3">{t.table.sellingPrice}</th>
                <th className="p-3">{t.table.minStock}</th>
                <th className="p-3">{t.table.status}</th>
                <th className="p-3">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {items.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={9}>{t.table.empty}</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="p-3">{item.sku}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{categoryLabel(item.category)}</td>
                    <td className="p-3">{item.default_uom}</td>
                    <td className="p-3">{item.purchase_price.toLocaleString(numberLocale)}</td>
                    <td className="p-3">{item.selling_price.toLocaleString(numberLocale)}</td>
                    <td className="p-3">{item.min_stock}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {item.is_active ? (locale === "en" ? "Active" : "Aktif") : (locale === "en" ? "Inactive" : "Tidak Aktif")}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button type="button" onClick={() => toggleItemMaster(item.id)} className="px-3 py-1.5 text-xs">
                        {item.is_active ? t.table.deactivate : t.table.activate}
                      </Button>
                    </td>
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
