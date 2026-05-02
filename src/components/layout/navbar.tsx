"use client";

import { usePathname } from "next/navigation";
import { useOfflineStore } from "@/lib/offlineStore";

const pageLabels: Record<string, { id: string; en: string }> = {
  "/": { id: "Ringkasan", en: "Overview" },
  "/dashboard": { id: "Dashboard", en: "Dashboard" },
  "/order": { id: "Sales Order", en: "Sales Order" },
  "/payment": { id: "Pembayaran", en: "Payment" },
  "/delivery-order": { id: "Pengiriman", en: "Delivery Order" },
  "/procurement": { id: "Pengadaan", en: "Procurement" },
  "/goods-receipt": { id: "Penerimaan", en: "Goods Receipt" },
  "/master-data": { id: "Master Data", en: "Master Data" },
  "/item-master": { id: "Master Item", en: "Item Master" },
  "/price-master": { id: "Master Harga", en: "Price Master" },
  "/uom-master": { id: "Master UoM", en: "UoM Master" },
  "/stock": { id: "Stok", en: "Inventory" },
  "/price": { id: "Harga", en: "Pricing" },
  "/journal": { id: "Jurnal", en: "Journal" },
  "/coa": { id: "COA", en: "COA" },
  "/report": { id: "Laporan", en: "Report" },
  "/profile": { id: "Profil", en: "Profile" },
  "/login": { id: "Masuk", en: "Login" },
  "/register": { id: "Daftar", en: "Register" },
};

export default function Navbar() {
  const pathname = usePathname();
  const locale = useOfflineStore((state) => state.locale);
  const activePage = pageLabels[pathname]?.[locale] ?? pathname.replace("/", "");
  const now = new Date().toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const opsLabel = locale === "en" ? "Operations Center" : "Pusat Operasi";
  const adminLabel = locale === "en" ? "Admin Farm" : "Admin Farm";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{opsLabel}</p>
          <h2 className="text-xl font-semibold capitalize text-slate-900">{activePage}</h2>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">{adminLabel}</p>
          <p className="text-xs text-slate-500">{now}</p>
        </div>
      </div>
    </header>
  );
}
