export interface Payment {
  id: string
  order_id: string
  payment_date: string
  payment_method: "qris" | "cash"
  is_paid: boolean
  amount: number
  payment_proof_url?: string
  verified_by?: string
  verified_at?: string
  created_at: string
}
