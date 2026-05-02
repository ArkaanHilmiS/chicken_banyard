export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  category: "aset" | "liabilitas" | "modal" | "pendapatan" | "beban";
  is_active: boolean;
  created_at: string;
}
