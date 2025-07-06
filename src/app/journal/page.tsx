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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Journal Report</h1>
      <button className="px-3 py-2 mb-4 bg-blue-500 text-white rounded">+ Tambah Jurnal</button>
      {loading ? <Loader /> : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tanggal</th>
              <th>Deskripsi</th>
              <th>Type</th>
              <th>Kategori</th>
              <th>Nominal</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {journals.map(j => (
              <tr key={j.id}>
                <td className="p-2">{j.transaction_date}</td>
                <td>{j.description}</td>
                <td>{j.type}</td>
                <td>{j.category}</td>
                <td>{j.amount}</td>
                <td>{j.user_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
