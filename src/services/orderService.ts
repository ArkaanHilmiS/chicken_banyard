import { supabase } from "@/utils/supabaseClient";
import { Order } from "@/types/order";

export async function getOrdersByUser(user_id: string): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").eq("user_id", user_id);
  if (error) {
    console.error("Failed to fetch orders", error);
    throw error;
  }

  return data || [];
}

export async function createOrder(order: Partial<Order>) {
  const { data, error } = await supabase.from("orders").insert(order);
  return { data, error };
}
