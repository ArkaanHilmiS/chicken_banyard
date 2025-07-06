export interface Order {
  id: string
  user_id: string
  order_date: string
  quantity_kg: number
  delivery_date: string
  delivery_time: string
  service_method: "antar" | "ambil"
  address: string
  payment_method: "qris" | "cash"
  payment_status: string
  receipt_confirmed: boolean
  price_per_kg_at_order: number
  total_price: number
  order_status: "pending" | "paid" | "cancelled" | "delivered"
  payment_id: string
  created_at: string
}
