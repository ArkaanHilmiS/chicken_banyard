"use client";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Payment } from "@/types/payment";
import { useOfflineStore } from "@/lib/offlineStore";

export default function PaymentPage() {
  const payments = useOfflineStore((state) => state.payments);
  const parties = useOfflineStore((state) => state.masterParties);
  const addPayment = useOfflineStore((state) => state.addPayment);
  const [direction, setDirection] = useState<"incoming" | "outgoing" | "">("");
  const [paymentFor, setPaymentFor] = useState<NonNullable<Payment["payment_for"]> | "">("");
  const [vendorName, setVendorName] = useState("");
  const [partyId, setPartyId] = useState("");
  const [method, setMethod] = useState<Payment["payment_method"] | "">("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const getDirection = (payment: Payment) => {
    if (payment.payment_direction) return payment.payment_direction;
    return payment.order_id ? "incoming" : "outgoing";
  };

  const incomingCount = payments.filter((p) => getDirection(p) === "incoming").length;
  const outgoingCount = payments.filter((p) => getDirection(p) === "outgoing").length;

  const directionOptions = [
    { value: "incoming", label: "Incoming" },
    { value: "outgoing", label: "Outgoing" },
  ];

  const paymentForOptions = [
    { value: "sales", label: "Sales" },
    { value: "electricity", label: "Electricity" },
    { value: "water", label: "Water" },
    { value: "chicken_feed", label: "Chicken Feed" },
    { value: "new_chicken", label: "New Chicken" },
    { value: "operational", label: "Operational" },
    { value: "asset", label: "Asset" },
    { value: "other", label: "Other" },
  ];

  const methodOptions = [
    { value: "cash", label: "Cash" },
    { value: "qris", label: "QRIS" },
  ];

  const partyOptions = useMemo(() => {
    if (!direction) return [];

    return parties
      .filter((party) => {
        if (direction === "incoming") {
          return party.party_type === "customer" || party.party_type === "stakeholder";
        }
        return party.party_type === "vendor" || party.party_type === "supplier" || party.party_type === "stakeholder";
      })
      .map((party) => ({ value: party.id, label: `${party.name} (${party.party_type})` }));
  }, [direction, parties]);

  const onDirectionChange = (value: "incoming" | "outgoing" | "") => {
    setDirection(value);
    setPartyId("");
    setVendorName("");
    setMethod("");

    if (value === "incoming") {
      setPaymentFor((prev) => (prev ? prev : "sales"));
    }
  };

  const onPartyChange = (value: string) => {
    setPartyId(value);
    const selectedParty = parties.find((party) => party.id === value);
    if (!selectedParty) return;

    setVendorName(selectedParty.name);
    if (selectedParty.preferred_payment_method) {
      setMethod(selectedParty.preferred_payment_method);
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!direction || !paymentFor || !method || !amount) {
      setMsg("Semua field wajib diisi kecuali vendor/pelanggan.");
      return;
    }

    addPayment({
      direction,
      amount: Number(amount),
      paymentFor,
      vendorName,
      method,
    });

    setMsg("Payment berhasil ditambahkan.");
    setDirection("");
    setPaymentFor("");
    setVendorName("");
    setMethod("");
    setAmount("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Cash In and Cash Out</h1>
            <p className="mt-1 text-sm text-slate-600">Data payment berjalan di memory offline sementara (tanpa database/storage).</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Select options={directionOptions} value={direction} onChange={(e) => onDirectionChange(e.target.value as "incoming" | "outgoing" | "")} required className="w-full" />
            <Select options={paymentForOptions} value={paymentFor} onChange={(e) => setPaymentFor(e.target.value as NonNullable<Payment["payment_for"]> | "")} required className="w-full" />
            <Select options={partyOptions} value={partyId} onChange={(e) => onPartyChange(e.target.value)} className="w-full" />
            <Select options={methodOptions} value={method} onChange={(e) => setMethod(e.target.value as Payment["payment_method"] | "")} required className="w-full" />
            <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Nominal" className="w-full" required />
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">+ Tambah Payment</Button>
            {msg && <p className="text-sm text-emerald-700">{msg}</p>}
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs uppercase tracking-wide text-emerald-700">Cash In</p>
            <p className="mt-1 text-xl font-semibold text-emerald-900">{incomingCount} transaksi</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">Cash Out</p>
            <p className="mt-1 text-xl font-semibold text-amber-900">{outgoingCount} transaksi</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Arah</th>
                <th className="p-3">Untuk</th>
                <th className="p-3">Vendor/Pelanggan</th>
                <th className="p-3">Metode</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bukti</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {payments.map((p) => {
                const direction = getDirection(p);
                return (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="p-3">{p.payment_date}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${direction === "incoming" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                        {direction}
                      </span>
                    </td>
                    <td className="p-3 capitalize">{p.payment_for || (p.order_id ? "sales" : "operational")}</td>
                    <td className="p-3">{p.vendor_name || "-"}</td>
                    <td className="p-3 uppercase">{p.payment_method}</td>
                    <td className="p-3">{p.amount}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.is_paid ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                        {p.is_paid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.payment_proof_url ? <a href={p.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">Bukti</a> : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
