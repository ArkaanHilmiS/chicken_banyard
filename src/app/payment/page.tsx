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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment List</h1>
      <button className="px-3 py-2 mb-4 bg-blue-500 text-white rounded">+ Tambah Payment</button>
      {loading ? <Loader /> : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tanggal</th>
              <th>Metode</th>
              <th>Jumlah</th>
              <th>Status</th>
              <th>Bukti</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td className="p-2">{p.payment_date}</td>
                <td>{p.payment_method}</td>
                <td>{p.amount}</td>
                <td>{p.is_paid ? "Paid" : "Pending"}</td>
                <td>{p.payment_proof_url ? <a href={p.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Bukti</a> : "-"}</td>
                <td>{p.verified_by ? `By ${p.verified_by}` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
