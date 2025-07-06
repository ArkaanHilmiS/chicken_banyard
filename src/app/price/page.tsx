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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Harga Telur</h1>
      <button className="px-3 py-2 mb-4 bg-blue-500 text-white rounded">+ Tambah Harga</button>
      {loading ? <Loader /> : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tanggal</th>
              <th>Harga/Kg</th>
            </tr>
          </thead>
          <tbody>
            {prices.map(p => (
              <tr key={p.id}>
                <td className="p-2">{p.price_date}</td>
                <td>{p.price_per_kg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
