import { supabase } from "@/utils/supabaseClient";
import { Stock } from "@/types/stock";

export async function getStocks(): Promise<Stock[]> {
  const { data, error } = await supabase.from("stocks").select("*").order("stock_date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createStock(payload: Omit<Stock, "id" | "created_at">) {
  const { data, error } = await supabase.from("stocks").insert([payload]);
  if (error) throw error;
  return data;
}
