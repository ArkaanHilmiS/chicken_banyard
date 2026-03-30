export interface ItemMaster {
  id: string
  sku: string
  name: string
  category: string
  default_uom: string
  purchase_price: number
  selling_price: number
  min_stock: number
  description?: string
  is_active: boolean
  created_at: string
}
