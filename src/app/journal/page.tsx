"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Journal } from "@/types/journal";
import Loader from "@/components/ui/loader";

export default function JournalPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      const { data, error } = await supabase.from("journals").select("*").order("transaction_date", { ascending: false });
      if (!error) setJournals(data || []);
      setLoading(false);
    };
    fetchJournals();
  }, []);

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Journal Ledger</h1>
        <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Tambah Jurnal</button>
      </div>
      {loading ? <Loader /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Type</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Nominal</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {journals.map((j) => (
                <tr key={j.id} className="border-b border-slate-100">
                  <td className="p-3">{j.transaction_date}</td>
                  <td className="p-3">{j.description}</td>
                  <td className="p-3 capitalize">{j.type}</td>
                  <td className="p-3">{j.category}</td>
                  <td className="p-3">{j.amount}</td>
                  <td className="p-3">{j.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
