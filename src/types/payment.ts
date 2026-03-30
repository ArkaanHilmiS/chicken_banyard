export interface Payment {
  id: string
  order_id: string
  purchase_id?: string
  payment_date: string
  payment_method: "qris" | "cash"
  payment_direction?: "incoming" | "outgoing"
  payment_for?: "sales" | "electricity" | "water" | "chicken_feed" | "new_chicken" | "operational" | "asset" | "other"
  expense_category?: "utility" | "feed" | "livestock" | "operational" | "asset" | "other"
  vendor_name?: string
  reference_type?: "order" | "purchase" | "journal" | "manual"
  reference_id?: string
  is_paid: boolean
  amount: number
  notes?: string
  payment_proof_url?: string
  verified_by?: string
  verified_at?: string
  created_at: string
}
