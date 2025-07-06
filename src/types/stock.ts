export interface Stock {
  id: string
  stock_date: string
  quantity_kg: number
  stock_type: "incoming" | "outgoing" | "adjustment"
  order_id?: string
  created_at: string
}
