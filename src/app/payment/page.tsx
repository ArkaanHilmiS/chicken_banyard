"use client";
import { Payment } from "@/types/payment";
import { useOfflineStore } from "@/lib/offlineStore";

export default function PaymentPage() {
  const payments = useOfflineStore((state) => state.payments);
  const addPayment = useOfflineStore((state) => state.addPayment);

  const getDirection = (payment: Payment) => {
    if (payment.payment_direction) return payment.payment_direction;
    return payment.order_id ? "incoming" : "outgoing";
  };

  const incomingCount = payments.filter((p) => getDirection(p) === "incoming").length;
  const outgoingCount = payments.filter((p) => getDirection(p) === "outgoing").length;

  const handleAddPayment = () => {
    addPayment({
      direction: "outgoing",
      amount: 250000,
      paymentFor: "water",
      vendorName: "PDAM",
      method: "cash",
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Cash In and Cash Out</h1>
            <p className="mt-1 text-sm text-slate-600">Data payment berjalan di memory offline sementara (tanpa database/storage).</p>
          </div>
          <button onClick={handleAddPayment} className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Tambah Payment</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
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
