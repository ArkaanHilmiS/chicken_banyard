"use client";
import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Payment } from "@/types/payment";
import { useOfflineStore } from "@/lib/offlineStore";

const formatPartyTypeLabel = (
  locale: "id" | "en",
  value: "customer" | "vendor" | "supplier" | "stakeholder",
) => {
  if (value === "customer") return locale === "en" ? "Customer" : "Pelanggan";
  if (value === "stakeholder") return locale === "en" ? "Stakeholder" : "Pemangku Kepentingan";
  return value === "vendor" ? "Vendor" : "Supplier";
};

export default function PaymentPage() {
  const payments = useOfflineStore((state) => state.payments);
  const orders = useOfflineStore((state) => state.orders);
  const purchases = useOfflineStore((state) => state.purchases);
  const parties = useOfflineStore((state) => state.masterParties);
  const addPayment = useOfflineStore((state) => state.addPayment);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";
  const [direction, setDirection] = useState<"incoming" | "outgoing" | "">("");
  const [referenceId, setReferenceId] = useState("");
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
    { value: "incoming", label: locale === "en" ? "Incoming" : "Masuk" },
    { value: "outgoing", label: locale === "en" ? "Outgoing" : "Keluar" },
  ];

  const paymentForOptions = [
    { value: "sales", label: locale === "en" ? "Sales" : "Penjualan" },
    { value: "electricity", label: locale === "en" ? "Electricity" : "Listrik" },
    { value: "water", label: locale === "en" ? "Water" : "Air" },
    { value: "chicken_feed", label: locale === "en" ? "Chicken Feed" : "Pakan" },
    { value: "new_chicken", label: locale === "en" ? "New Chicken" : "Ayam Baru" },
    { value: "operational", label: locale === "en" ? "Operational" : "Operasional" },
    { value: "asset", label: locale === "en" ? "Asset" : "Aset" },
    { value: "other", label: locale === "en" ? "Other" : "Lainnya" },
  ];

  const methodOptions = [
    { value: "cash", label: locale === "en" ? "Cash" : "Tunai" },
    { value: "qris", label: "QRIS" },
  ];

  const partyOptions = useMemo(() => {
    if (!direction) return [];

    const baseOptions = parties
      .filter((party) => {
        if (!party.is_active) return false;
        if (direction === "incoming") {
          return party.party_type === "customer" || party.party_type === "stakeholder";
        }
        return party.party_type === "vendor" || party.party_type === "supplier" || party.party_type === "stakeholder";
      })
      .map((party) => ({ value: party.id, label: `${party.name} (${formatPartyTypeLabel(locale, party.party_type)})` }));

    if (!partyId || !vendorName || baseOptions.some((option) => option.value === partyId)) return baseOptions;
    return [{ value: partyId, label: `${vendorName} (${locale === "en" ? "Inactive" : "Tidak Aktif"})` }, ...baseOptions];
  }, [direction, locale, parties, partyId, vendorName]);

  const onDirectionChange = (value: "incoming" | "outgoing" | "") => {
    setDirection(value);
    setReferenceId("");
    setPartyId("");
    setVendorName("");
    setMethod("");
    setAmount("");

    if (value === "incoming") {
      setPaymentFor((prev) => (prev ? prev : "sales"));
    }
  };

  const referenceOptions = useMemo(() => {
    if (!direction) return [];

    if (direction === "incoming") {
      return orders
        .filter((order) => order.payment_status !== "paid")
        .map((order) => ({
          value: order.id,
          label: `${order.id} - ${order.address} - Rp ${order.total_price.toLocaleString(numberLocale)}`,
        }));
    }

    return purchases
      .filter((purchase) => purchase.payment_status !== "paid")
      .map((purchase) => ({
        value: purchase.id,
        label: `${purchase.id} - ${purchase.vendor_name} - Rp ${purchase.total_price.toLocaleString(numberLocale)}`,
      }));
  }, [direction, numberLocale, orders, purchases]);

  const onReferenceChange = (value: string) => {
    setReferenceId(value);

    if (!direction || !value) return;

    if (direction === "incoming") {
      const selectedOrder = orders.find((order) => order.id === value);
      if (!selectedOrder) return;

      setAmount(String(selectedOrder.total_price));
      setPaymentFor("sales");
      const customer = parties.find((party) => party.name.toLowerCase() === selectedOrder.address.toLowerCase());
      if (customer) {
        setPartyId(customer.id);
        setVendorName(customer.name);
        if (customer.preferred_payment_method) setMethod(customer.preferred_payment_method);
      }
      return;
    }

    const selectedPurchase = purchases.find((purchase) => purchase.id === value);
    if (!selectedPurchase) return;

    setAmount(String(selectedPurchase.total_price));
    const outgoingPaymentFor: NonNullable<Payment["payment_for"]> = (() => {
      if (selectedPurchase.category === "utility") return "electricity";
      if (selectedPurchase.category === "feed") return "chicken_feed";
      if (selectedPurchase.category === "livestock") return "new_chicken";
      if (selectedPurchase.category === "asset") return "asset";
      if (selectedPurchase.category === "operational") return "operational";
      return "other";
    })();
    setPaymentFor(outgoingPaymentFor);

    const supplier = parties.find((party) => party.name.toLowerCase() === selectedPurchase.vendor_name.toLowerCase());
    if (supplier) {
      setPartyId(supplier.id);
      setVendorName(supplier.name);
      if (supplier.preferred_payment_method) setMethod(supplier.preferred_payment_method);
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
      setMsg(locale === "en" ? "All fields are required except vendor/customer." : "Semua field wajib diisi kecuali vendor/pelanggan.");
      return;
    }

    addPayment({
      direction,
      amount: Number(amount),
      paymentFor,
      vendorName,
      method,
      referenceId: referenceId || undefined,
    });

    setMsg(locale === "en" ? "Payment added successfully." : "Payment berhasil ditambahkan.");
    setDirection("");
    setReferenceId("");
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
            <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Cash In and Cash Out" : "Cash In dan Cash Out"}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "en"
                ? "Payments are integrated with Sales Orders and Purchase Orders, including auto journal posting."
                : "Payment terintegrasi dengan Sales Order dan Purchase Order, termasuk auto posting ke jurnal."}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Direction" : "Arah"}</label>
              <Select options={directionOptions} value={direction} onChange={(e) => onDirectionChange(e.target.value as "incoming" | "outgoing" | "")} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Reference" : "Referensi"}</label>
              <Select options={referenceOptions} value={referenceId} onChange={(e) => onReferenceChange(e.target.value)} className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Payment For" : "Untuk"}</label>
              <Select options={paymentForOptions} value={paymentFor} onChange={(e) => setPaymentFor(e.target.value as NonNullable<Payment["payment_for"]> | "")} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Vendor/Customer" : "Vendor/Pelanggan"}</label>
              <Select options={partyOptions} value={partyId} onChange={(e) => onPartyChange(e.target.value)} className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Method" : "Metode"}</label>
              <Select options={methodOptions} value={method} onChange={(e) => setMethod(e.target.value as Payment["payment_method"] | "")} required className="w-full" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Amount" : "Nominal"}</label>
              <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={locale === "en" ? "Amount" : "Nominal"} className="w-full" required />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button type="submit">{locale === "en" ? "+ Add Payment" : "+ Tambah Payment"}</Button>
            {msg && (
              <p className={`text-sm ${msg.toLowerCase().includes("success") || msg.toLowerCase().includes("berhasil") ? "text-emerald-700" : "text-rose-600"}`}>
                {msg}
              </p>
            )}
          </div>
        </form>

        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs uppercase tracking-wide text-emerald-700">{locale === "en" ? "Cash In" : "Kas Masuk"}</p>
            <p className="mt-1 text-xl font-semibold text-emerald-900">{incomingCount} {locale === "en" ? "transactions" : "transaksi"}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">{locale === "en" ? "Cash Out" : "Kas Keluar"}</p>
            <p className="mt-1 text-xl font-semibold text-amber-900">{outgoingCount} {locale === "en" ? "transactions" : "transaksi"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Date" : "Tanggal"}</th>
                <th className="p-3">{locale === "en" ? "Direction" : "Arah"}</th>
                <th className="p-3">{locale === "en" ? "Reference" : "Referensi"}</th>
                <th className="p-3">{locale === "en" ? "For" : "Untuk"}</th>
                <th className="p-3">{locale === "en" ? "Vendor/Customer" : "Vendor/Pelanggan"}</th>
                <th className="p-3">{locale === "en" ? "Method" : "Metode"}</th>
                <th className="p-3">{locale === "en" ? "Amount" : "Jumlah"}</th>
                <th className="p-3">{locale === "en" ? "Status" : "Status"}</th>
                <th className="p-3">{locale === "en" ? "Proof" : "Bukti"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {payments.map((p) => {
                const direction = getDirection(p);
                const directionLabel = direction === "incoming"
                  ? (locale === "en" ? "incoming" : "masuk")
                  : (locale === "en" ? "outgoing" : "keluar");
                const paymentForLabel = paymentForOptions.find((option) => option.value === p.payment_for)?.label
                  ?? (p.order_id ? (locale === "en" ? "sales" : "penjualan") : (locale === "en" ? "operational" : "operasional"));

                return (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="p-3">{p.payment_date}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${direction === "incoming" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                        {directionLabel}
                      </span>
                    </td>
                    <td className="p-3">{p.reference_id || p.order_id || p.purchase_id || "-"}</td>
                    <td className="p-3">{paymentForLabel}</td>
                    <td className="p-3">{p.vendor_name || "-"}</td>
                    <td className="p-3 uppercase">{p.payment_method}</td>
                    <td className="p-3">{p.amount.toLocaleString(numberLocale)}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.is_paid ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                        {p.is_paid ? (locale === "en" ? "Paid" : "Lunas") : (locale === "en" ? "Pending" : "Pending")}
                      </span>
                    </td>
                    <td className="p-3">
                      {p.payment_proof_url
                        ? (
                          <a href={p.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
                            {locale === "en" ? "View" : "Bukti"}
                          </a>
                        )
                        : "-"}
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
