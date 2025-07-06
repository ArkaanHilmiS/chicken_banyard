import { supabase } from "@/utils/supabaseClient";
import { User } from "@/types/user";

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
  if (error) return null;
  return data as User;
}
