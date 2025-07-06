import { supabase } from "@/utils/supabaseClient";
import { Price } from "@/types/price";

export async function getPrices(): Promise<Price[]> {
  const { data, error } = await supabase.from("prices").select("*").order("price_date", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createPrice(payload: Omit<Price, "id" | "created_at">) {
  const { data, error } = await supabase.from("prices").insert([payload]);
  if (error) throw error;
  return data;
}
