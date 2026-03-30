export interface PriceMaster {
  id: string
  item_id: string
  item_name: string
  uom: string
  price_type: "purchase" | "selling" | "wholesale" | "retail"
  price_value: number
  effective_date: string
  payment_method?: "cash" | "qris"
  transaction_method?: "cash-in" | "cash-out" | "transfer" | "hybrid"
  created_at: string
}
