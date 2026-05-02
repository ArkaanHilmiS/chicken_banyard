"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";

export default function UomMasterPage() {
  const uoms = useOfflineStore((state) => state.unitOfMeasures);
  const addUnitOfMeasure = useOfflineStore((state) => state.addUnitOfMeasure);
  const toggleUnitOfMeasure = useOfflineStore((state) => state.toggleUnitOfMeasure);
  const locale = useOfflineStore((state) => state.locale);

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState("active");
  const [msg, setMsg] = useState("");
  const statusOptions = [
    { value: "active", label: locale === "en" ? "Active" : "Aktif" },
    { value: "inactive", label: locale === "en" ? "Inactive" : "Tidak Aktif" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol) {
      setMsg(locale === "en" ? "UoM name and symbol are required." : "Nama dan simbol UoM wajib diisi.");
      return;
    }

    addUnitOfMeasure({
      name,
      symbol,
      description: description || undefined,
      isActive: isActive === "active",
    });

    setMsg(locale === "en" ? "Unit of Measure added successfully." : "Unit of Measure berhasil ditambahkan.");
    setName("");
    setSymbol("");
    setDescription("");
    setIsActive("active");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Unit of Measure Master Data" : "Master Data Unit of Measure"}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en"
            ? "Manage unit measures such as kg, sack, pack, liter, and others."
            : "Kelola satuan unit seperti kg, sak, paket, liter, dan lainnya."}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={locale === "en" ? "UoM Name" : "Nama UoM"} className="w-full" required />
            <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder={locale === "en" ? "Symbol (kg/sack/ltr)" : "Simbol (kg/sak/ltr)"} className="w-full" required />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={locale === "en" ? "Description" : "Deskripsi"} className="w-full" />
            <Select options={statusOptions} value={isActive} onChange={(e) => setIsActive(e.target.value)} required className="w-full" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{locale === "en" ? "+ Add UoM" : "+ Tambah UoM"}</Button>
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
                <th className="p-3">{locale === "en" ? "Name" : "Nama"}</th>
                <th className="p-3">{locale === "en" ? "Symbol" : "Simbol"}</th>
                <th className="p-3">{locale === "en" ? "Description" : "Deskripsi"}</th>
                <th className="p-3">{locale === "en" ? "Status" : "Status"}</th>
                <th className="p-3">{locale === "en" ? "Action" : "Aksi"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {uoms.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={5}>{locale === "en" ? "No UoM data yet." : "Belum ada data UoM."}</td>
                </tr>
              ) : (
                uoms.map((uom) => (
                  <tr key={uom.id} className="border-b border-slate-100">
                    <td className="p-3">{uom.name}</td>
                    <td className="p-3">{uom.symbol}</td>
                    <td className="p-3">{uom.description || "-"}</td>
                    <td className="p-3">{uom.is_active ? (locale === "en" ? "Active" : "Aktif") : (locale === "en" ? "Inactive" : "Tidak Aktif")}</td>
                    <td className="p-3">
                      <Button type="button" onClick={() => toggleUnitOfMeasure(uom.id)} className="px-3 py-1.5 text-xs">
                        {uom.is_active ? (locale === "en" ? "Deactivate" : "Nonaktifkan") : (locale === "en" ? "Activate" : "Aktifkan")}
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
