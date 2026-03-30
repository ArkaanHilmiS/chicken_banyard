"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Payment } from "@/types/payment";
import Loader from "@/components/ui/loader";

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase.from("payments").select("*").order("payment_date", { ascending: false });
      if (!error) setPayments(data || []);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Payment Management</h1>
        <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Tambah Payment</button>
      </div>
      {loading ? <Loader /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Metode</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bukti</th>
                <th className="p-3">Verified</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="p-3">{p.payment_date}</td>
                  <td className="p-3 uppercase">{p.payment_method}</td>
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${p.is_paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                      {p.is_paid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.payment_proof_url ? <a href={p.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">Bukti</a> : "-"}
                  </td>
                  <td className="p-3">{p.verified_by ? `By ${p.verified_by}` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
