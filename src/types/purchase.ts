export interface Purchase {
  id: string
  po_number?: string
  purchase_date: string
  vendor_name: string
  item_id: string
  item_name: string
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  category: "operational" | "utility" | "livestock" | "feed" | "asset" | "other"
  payment_status: "pending" | "paid" | "partial"
  notes?: string
  created_at: string
}