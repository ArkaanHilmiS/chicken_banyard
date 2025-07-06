export interface Journal {
  id: string
  transaction_date: string
  description: string
  type: string
  amount: number
  category: "aset" | "liabilitas" | "modal" | "pendapatan" | "beban"
  ref_table?: string
  ref_id?: string
  user_id: string
  created_at: string
}
