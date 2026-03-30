"use client";
import { useState } from "react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { useOfflineStore } from "@/lib/offlineStore";

// Opsi dropdown sesuai enum pada database
const serviceMethods = [
  { value: "antar", label: "Antar" },
  { value: "ambil", label: "Ambil Sendiri" },
];

export default function OrderPage() {
  const addOrder = useOfflineStore((state) => state.addOrder);
  const [qty, setQty] = useState("");
  const [serviceMethod, setServiceMethod] = useState<"antar" | "ambil" | "">("");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sederhana
    if (!qty || !serviceMethod || !address) {
      setMsg("Semua field wajib diisi");
      return;
    }
    addOrder({
      quantityKg: Number(qty),
      serviceMethod,
      address,
    });
    setMsg("Pesanan berhasil disimpan sementara (offline).");
    setQty("");
    setServiceMethod("");
    setAddress("");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h1 className="text-xl font-semibold text-slate-900">Sales Order Baru</h1>
        <p className="mt-1 text-sm text-slate-600">Input pesanan pelanggan untuk diproses ke payment, stok, dan laporan.</p>

        <form onSubmit={handleOrder} className="mt-5 space-y-3">
          <Input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Jumlah telur (kg)"
            required
            min={1}
            className="w-full"
          />
          <Select
            options={serviceMethods}
            value={serviceMethod}
            onChange={(e) => setServiceMethod(e.target.value as "antar" | "ambil" | "")}
            required
            className="w-full"
          />
          <Input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap"
            required
            className="w-full"
          />
          <Button type="submit" className="w-full">Simpan Order</Button>
          {msg && (
            <div className={`mt-2 text-sm ${msg.includes("berhasil") ? "text-emerald-700" : "text-red-600"}`}>
              {msg}
            </div>
          )}
        </form>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Catatan Operasional</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Gunakan metode Antar jika pesanan dikirim ke pelanggan.</li>
          <li>Pastikan alamat lengkap sebelum order diproses.</li>
          <li>Setelah order tersimpan, lanjutkan ke modul Payment.</li>
        </ul>
      </aside>
    </div>
  );
}
