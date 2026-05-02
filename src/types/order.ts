export interface Order {
  id: string
  so_number?: string
  user_id: string
  order_date: string
  item_id: string
  item_name: string
  quantity: number
  unit: string
  delivery_date: string
  delivery_time: string
  service_method: "antar" | "ambil"
  address: string
  payment_method: "qris" | "cash"
  payment_status: string
  receipt_confirmed: boolean
  unit_price_at_order: number
  total_price: number
  order_status: "pending" | "paid" | "cancelled" | "delivered"
  payment_id: string
  created_at: string
}
