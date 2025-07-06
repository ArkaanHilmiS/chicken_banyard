"use client";
import { useState } from "react";
import { createOrder } from "@/services/orderService";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import type { Order } from "@/types/order";

// Opsi dropdown sesuai enum pada database
const serviceMethods = [
  { value: "antar", label: "Antar" },
  { value: "ambil", label: "Ambil Sendiri" },
];

export default function OrderPage() {
  // Gunakan union type agar kompatibel dengan Order['service_method']
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
    // Kirim ke service
    const { error } = await createOrder({
      user_id: "user_id_dummy", // Ganti dengan user id yang benar
      quantity_kg: Number(qty),
      service_method: serviceMethod as Order["service_method"], // type-safe
      address,
    });
    setMsg(error ? error.message : "Pesanan berhasil!");
  };

  return (
    <form onSubmit={handleOrder} className="space-y-3 max-w-md mx-auto p-4">
      <Input
        type="number"
        value={qty}
        onChange={e => setQty(e.target.value)}
        placeholder="Jumlah Telur (kg)"
        required
        min={1}
      />
      <Select
        options={serviceMethods}
        value={serviceMethod}
        onChange={e => setServiceMethod(e.target.value as "antar" | "ambil" | "")}
        required
      />
      <Input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Alamat lengkap"
        required
      />
      <Button type="submit">Pesan</Button>
      {msg && (
        <div className={`mt-2 text-sm ${msg.includes("berhasil") ? "text-green-600" : "text-red-500"}`}>
          {msg}
        </div>
      )}
    </form>
  );
}
