export interface MasterParty {
  id: string
  party_type: "customer" | "vendor" | "supplier" | "stakeholder"
  name: string
  email?: string
  phone?: string
  address?: string
  npwp?: string
  bank_name?: string
  bank_account_number?: string
  bank_account_name?: string
  preferred_payment_method?: "cash" | "qris"
  preferred_transaction_method?: "cash-in" | "cash-out" | "transfer" | "hybrid"
  total_transaction_rp: number
  transaction_count: number
  notes?: string
  created_at: string
}