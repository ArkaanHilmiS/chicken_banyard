"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";
import type { MasterParty } from "@/types/masterParty";

export default function MasterDataPage() {
  const masterParties = useOfflineStore((state) => state.masterParties);
  const addMasterParty = useOfflineStore((state) => state.addMasterParty);

  const [partyType, setPartyType] = useState<MasterParty["party_type"] | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [npwp, setNpwp] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<"cash" | "qris" | "">("");
  const [preferredTransactionMethod, setPreferredTransactionMethod] = useState<"cash-in" | "cash-out" | "transfer" | "hybrid" | "">("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const partyTypeOptions = [
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "supplier", label: "Supplier" },
    { value: "stakeholder", label: "Stakeholder" },
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

  const totalTransactionAll = useMemo(
    () => masterParties.reduce((sum, party) => sum + party.total_transaction_rp, 0),
    [masterParties],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyType || !name) {
      setMsg("Jenis pihak dan nama wajib diisi.");
      return;
    }

    addMasterParty({
      partyType,
      name,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      npwp: npwp || undefined,
      bankName: bankName || undefined,
      bankAccountNumber: bankAccountNumber || undefined,
      bankAccountName: bankAccountName || undefined,
      preferredPaymentMethod: preferredPaymentMethod || undefined,
      preferredTransactionMethod: preferredTransactionMethod || undefined,
      notes: notes || undefined,
    });

    setMsg("Master data berhasil ditambahkan.");
    setPartyType("");
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNpwp("");
    setBankName("");
    setBankAccountNumber("");
    setBankAccountName("");
    setPreferredPaymentMethod("");
    setPreferredTransactionMethod("");
    setNotes("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Master Data</h1>
        <p className="mt-1 text-sm text-slate-600">Kelola data customer, vendor, supplier, dan stakeholder, termasuk NPWP, no rekening, metode transaksi, dan total transaksi.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select options={partyTypeOptions} value={partyType} onChange={(e) => setPartyType(e.target.value as MasterParty["party_type"] | "")} required className="w-full" />
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama pihak" className="w-full" required />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full" />
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No HP" className="w-full" />
            <Input value={npwp} onChange={(e) => setNpwp(e.target.value)} placeholder="NPWP / Nomor pajak" className="w-full" />
            <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Nama bank" className="w-full" />
            <Input value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} placeholder="No rekening" className="w-full" />
            <Input value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} placeholder="Atas nama rekening" className="w-full" />
            <Select options={paymentMethodOptions} value={preferredPaymentMethod} onChange={(e) => setPreferredPaymentMethod(e.target.value as "cash" | "qris" | "")} className="w-full" />
            <Select options={transactionMethodOptions} value={preferredTransactionMethod} onChange={(e) => setPreferredTransactionMethod(e.target.value as "cash-in" | "cash-out" | "transfer" | "hybrid" | "")} className="w-full" />
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat" className="w-full xl:col-span-2" />
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan" className="w-full xl:col-span-2" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Tambah Master Data</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Daftar Master Data</h2>
          <p className="text-sm text-slate-600">Total transaksi seluruh pihak: Rp {totalTransactionAll.toLocaleString("id-ID")}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Jenis</th>
                <th className="p-3">Nama</th>
                <th className="p-3">NPWP</th>
                <th className="p-3">No Rekening</th>
                <th className="p-3">Metode Bayar</th>
                <th className="p-3">Metode Transaksi</th>
                <th className="p-3">Jumlah Transaksi</th>
                <th className="p-3">Total Transaksi (Rp)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {masterParties.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={8}>Belum ada data master.</td>
                </tr>
              ) : (
                masterParties.map((party) => (
                  <tr key={party.id} className="border-b border-slate-100">
                    <td className="p-3 capitalize">{party.party_type}</td>
                    <td className="p-3">{party.name}</td>
                    <td className="p-3">{party.npwp || "-"}</td>
                    <td className="p-3">{party.bank_account_number || "-"}</td>
                    <td className="p-3 uppercase">{party.preferred_payment_method || "-"}</td>
                    <td className="p-3">{party.preferred_transaction_method || "-"}</td>
                    <td className="p-3">{party.transaction_count}</td>
                    <td className="p-3">{party.total_transaction_rp.toLocaleString("id-ID")}</td>
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
