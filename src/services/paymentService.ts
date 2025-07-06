import { supabase } from "@/utils/supabaseClient";
import { Payment } from "@/types/payment";

export async function getPaymentsByOrder(order_id: string): Promise<Payment[]> {
  const { data } = await supabase.from("payments").select("*").eq("order_id", order_id);
  return data || [];
}
