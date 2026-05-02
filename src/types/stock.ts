export interface Stock {
  id: string
  stock_date: string
  item_id: string
  item_name: string
  unit: string
  quantity: number
  warehouse_id: string
  warehouse_name: string
  stock_type: "incoming" | "outgoing" | "adjustment"
  order_id?: string
  created_at: string
}
