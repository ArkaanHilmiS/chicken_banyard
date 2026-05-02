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
  const toggleMasterParty = useOfflineStore((state) => state.toggleMasterParty);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";

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
  const [isActive, setIsActive] = useState("active");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const partyTypeOptions = [
    { value: "customer", label: locale === "en" ? "Customer" : "Pelanggan" },
    { value: "vendor", label: locale === "en" ? "Vendor" : "Vendor" },
    { value: "supplier", label: locale === "en" ? "Supplier" : "Supplier" },
    { value: "stakeholder", label: locale === "en" ? "Stakeholder" : "Pemangku Kepentingan" },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: locale === "en" ? "Cash" : "Tunai" },
    { value: "qris", label: "QRIS" },
  ];

  const transactionMethodOptions = [
    { value: "cash-in", label: locale === "en" ? "Cash In" : "Kas Masuk" },
    { value: "cash-out", label: locale === "en" ? "Cash Out" : "Kas Keluar" },
    { value: "transfer", label: locale === "en" ? "Transfer" : "Transfer" },
    { value: "hybrid", label: locale === "en" ? "Hybrid" : "Hybrid" },
  ];
  const statusOptions = [
    { value: "active", label: locale === "en" ? "Active" : "Aktif" },
    { value: "inactive", label: locale === "en" ? "Inactive" : "Tidak Aktif" },
  ];

  const partyTypeLabel = (type: MasterParty["party_type"]) => {
    const match = partyTypeOptions.find((option) => option.value === type);
    return match?.label ?? type;
  };

  const paymentMethodLabel = (value?: "cash" | "qris") => {
    const match = paymentMethodOptions.find((option) => option.value === value);
    return match?.label ?? "-";
  };

  const transactionMethodLabel = (value?: "cash-in" | "cash-out" | "transfer" | "hybrid") => {
    const match = transactionMethodOptions.find((option) => option.value === value);
    return match?.label ?? "-";
  };

  const totalTransactionAll = useMemo(
    () => masterParties.reduce((sum, party) => sum + party.total_transaction_rp, 0),
    [masterParties],
  );

  const activeCount = useMemo(
    () => masterParties.filter((party) => party.is_active).length,
    [masterParties],
  );

  const t = locale === "en"
    ? {
        title: "Master Data",
        description: "Manage customers, vendors, suppliers, and stakeholders including tax IDs, bank accounts, transaction methods, and totals.",
        requiredNote: "All fields are required.",
        requiredMessage: "All fields are required.",
        successMessage: "Master data added successfully.",
        totalTransaction: "Total transactions (Rp):",
        form: {
          partyType: "Party type",
          name: "Party name",
          email: "Email",
          phone: "Phone",
          npwp: "Tax ID",
          bankName: "Bank name",
          bankAccountNumber: "Account number",
          bankAccountName: "Account holder",
          paymentMethod: "Payment method",
          transactionMethod: "Transaction method",
          status: "Status",
          address: "Address",
          notes: "Notes",
          submit: "+ Add Master Data",
        },
        table: {
          title: "Master Data List",
          empty: "No master data yet.",
          statusSummary: "Active records",
          type: "Type",
          name: "Name",
          npwp: "Tax ID",
          bankAccount: "Bank Account",
          paymentMethod: "Payment Method",
          transactionMethod: "Transaction Method",
          status: "Status",
          transactionCount: "Transactions",
          transactionTotal: "Total (Rp)",
          action: "Action",
          activate: "Activate",
          deactivate: "Deactivate",
        },
      }
    : {
        title: "Master Data",
        description: "Kelola data customer, vendor, supplier, dan stakeholder, termasuk NPWP, no rekening, metode transaksi, dan total transaksi.",
        requiredNote: "Semua field wajib diisi.",
        requiredMessage: "Semua field wajib diisi.",
        successMessage: "Master data berhasil ditambahkan.",
        totalTransaction: "Total transaksi seluruh pihak:",
        form: {
          partyType: "Jenis pihak",
          name: "Nama pihak",
          email: "Email",
          phone: "No HP",
          npwp: "NPWP / Nomor pajak",
          bankName: "Nama bank",
          bankAccountNumber: "No rekening",
          bankAccountName: "Atas nama rekening",
          paymentMethod: "Metode bayar",
          transactionMethod: "Metode transaksi",
          status: "Status",
          address: "Alamat",
          notes: "Catatan",
          submit: "+ Tambah Master Data",
        },
        table: {
          title: "Daftar Master Data",
          empty: "Belum ada data master.",
          statusSummary: "Data aktif",
          type: "Jenis",
          name: "Nama",
          npwp: "NPWP",
          bankAccount: "No Rekening",
          paymentMethod: "Metode Bayar",
          transactionMethod: "Metode Transaksi",
          status: "Status",
          transactionCount: "Jumlah Transaksi",
          transactionTotal: "Total Transaksi (Rp)",
          action: "Aksi",
          activate: "Aktifkan",
          deactivate: "Nonaktifkan",
        },
      };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyType || !preferredPaymentMethod || !preferredTransactionMethod) {
      setMsg(t.requiredMessage);
      return;
    }

    const requiredValues = [
      name,
      email,
      phone,
      address,
      npwp,
      bankName,
      bankAccountNumber,
      bankAccountName,
      notes,
    ];

    if (requiredValues.some((value) => String(value).trim() === "")) {
      setMsg(t.requiredMessage);
      return;
    }

    addMasterParty({
      partyType,
      name,
      email,
      phone,
      address,
      npwp,
      bankName,
      bankAccountNumber,
      bankAccountName,
      preferredPaymentMethod,
      preferredTransactionMethod,
      notes,
      isActive: isActive === "active",
    });

    setMsg(t.successMessage);
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
    setIsActive("active");
    setNotes("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">{t.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{t.description}</p>
        <p className="mt-1 text-sm text-slate-500">{t.requiredNote}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.partyType}</label>
              <Select options={partyTypeOptions} value={partyType} onChange={(e) => setPartyType(e.target.value as MasterParty["party_type"] | "")} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.name}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={`${t.form.name} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.email}</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`${t.form.email} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.phone}</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`${t.form.phone} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.npwp}</label>
              <Input value={npwp} onChange={(e) => setNpwp(e.target.value)} placeholder={`${t.form.npwp} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.bankName}</label>
              <Input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder={`${t.form.bankName} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.bankAccountNumber}</label>
              <Input value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)} placeholder={`${t.form.bankAccountNumber} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.bankAccountName}</label>
              <Input value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)} placeholder={`${t.form.bankAccountName} *`} className="w-full" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.paymentMethod}</label>
              <Select options={paymentMethodOptions} value={preferredPaymentMethod} onChange={(e) => setPreferredPaymentMethod(e.target.value as "cash" | "qris" | "")} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.transactionMethod}</label>
              <Select options={transactionMethodOptions} value={preferredTransactionMethod} onChange={(e) => setPreferredTransactionMethod(e.target.value as "cash-in" | "cash-out" | "transfer" | "hybrid" | "")} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{t.form.status}</label>
              <Select options={statusOptions} value={isActive} onChange={(e) => setIsActive(e.target.value)} required className="w-full" />
            </div>
            <div className="space-y-1 xl:col-span-2">
              <label className="text-xs font-medium text-slate-600">{t.form.address}</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={`${t.form.address} *`} className="w-full" required />
            </div>
            <div className="space-y-1 xl:col-span-2">
              <label className="text-xs font-medium text-slate-600">{t.form.notes}</label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={`${t.form.notes} *`} className="w-full" required />
            </div>
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
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{t.table.title}</h2>
          <div className="text-right text-sm text-slate-600">
            <p>{t.totalTransaction} Rp {totalTransactionAll.toLocaleString(numberLocale)}</p>
            <p>{t.table.statusSummary}: {activeCount}/{masterParties.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{t.table.type}</th>
                <th className="p-3">{t.table.name}</th>
                <th className="p-3">{t.table.npwp}</th>
                <th className="p-3">{t.table.bankAccount}</th>
                <th className="p-3">{t.table.paymentMethod}</th>
                <th className="p-3">{t.table.transactionMethod}</th>
                <th className="p-3">{t.table.status}</th>
                <th className="p-3">{t.table.transactionCount}</th>
                <th className="p-3">{t.table.transactionTotal}</th>
                <th className="p-3">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {masterParties.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={10}>{t.table.empty}</td>
                </tr>
              ) : (
                masterParties.map((party) => (
                  <tr key={party.id} className="border-b border-slate-100">
                    <td className="p-3">{partyTypeLabel(party.party_type)}</td>
                    <td className="p-3">{party.name}</td>
                    <td className="p-3">{party.npwp || "-"}</td>
                    <td className="p-3">{party.bank_account_number || "-"}</td>
                    <td className="p-3">{paymentMethodLabel(party.preferred_payment_method)}</td>
                    <td className="p-3">{transactionMethodLabel(party.preferred_transaction_method)}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${party.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {party.is_active ? (locale === "en" ? "Active" : "Aktif") : (locale === "en" ? "Inactive" : "Tidak Aktif")}
                      </span>
                    </td>
                    <td className="p-3">{party.transaction_count}</td>
                    <td className="p-3">{party.total_transaction_rp.toLocaleString(numberLocale)}</td>
                    <td className="p-3">
                      <Button type="button" onClick={() => toggleMasterParty(party.id)} className="px-3 py-1.5 text-xs">
                        {party.is_active ? t.table.deactivate : t.table.activate}
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
