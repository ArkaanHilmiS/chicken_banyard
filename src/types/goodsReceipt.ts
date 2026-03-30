export interface GoodsReceipt {
  id: string
  receipt_date: string
  purchase_id?: string
  vendor_name: string
  item_name: string
  quantity_received: number
  unit: string
  condition: "good" | "damaged" | "partial"
  warehouse_location?: string
  notes?: string
  received_by?: string
  created_at: string
}