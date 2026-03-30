"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Price } from "@/types/price";
import Loader from "@/components/ui/loader";

export default function PricePage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase.from("prices").select("*").order("price_date", { ascending: false });
      if (!error) setPrices(data || []);
      setLoading(false);
    };
    fetchPrices();
  }, []);

  return (
    <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Pricing Table</h1>
        <button className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Tambah Harga</button>
      </div>
      {loading ? <Loader /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Harga / Kg</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {prices.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="p-3">{p.price_date}</td>
                  <td className="p-3 font-medium">{p.price_per_kg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
