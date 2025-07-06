"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { Stock } from "@/types/stock";
import Loader from "@/components/ui/loader";

export default function StockPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      const { data, error } = await supabase.from("stocks").select("*").order("stock_date", { ascending: false });
      if (!error) setStocks(data || []);
      setLoading(false);
    };
    fetchStocks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock List</h1>
      <button className="px-3 py-2 mb-4 bg-blue-500 text-white rounded">+ Tambah Stock</button>
      {loading ? <Loader /> : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Tanggal</th>
              <th>Jumlah (Kg)</th>
              <th>Jenis</th>
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(s => (
              <tr key={s.id}>
                <td className="p-2">{s.stock_date}</td>
                <td>{s.quantity_kg}</td>
                <td>{s.stock_type}</td>
                <td>{s.order_id || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
