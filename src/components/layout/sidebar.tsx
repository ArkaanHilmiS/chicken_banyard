"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Select from "@/components/ui/select";
import { useOfflineStore } from "@/lib/offlineStore";

const menuSections = [
  {
    key: "home",
    title: { id: "Beranda", en: "Home" },
    items: [
      { href: "/", label: { id: "Ringkasan", en: "Overview" } },
    ],
  },
  {
    key: "business",
    title: { id: "Bisnis", en: "Process" },
    items: [
      { href: "/order", label: { id: "Sales Order", en: "Sales Order" } },
      { href: "/payment", label: { id: "Pembayaran", en: "Payment" } },
      { href: "/delivery-order", label: { id: "Pengiriman", en: "Delivery Order" } },
      { href: "/procurement", label: { id: "Pengadaan", en: "Procurement" } },
      { href: "/goods-receipt", label: { id: "Penerimaan", en: "Goods Receipt" } },
      { href: "/stock", label: { id: "Stok", en: "Inventory" } },
      { href: "/price", label: { id: "Harga", en: "Pricing" } },
    ],
  },
  {
    key: "config",
    title: { id: "Konfig", en: "Config" },
    items: [
      { href: "/master-data", label: { id: "Master Data", en: "Master Data" } },
      { href: "/item-master", label: { id: "Master Item", en: "Item Master" } },
      { href: "/uom-master", label: { id: "Master UoM", en: "UoM Master" } },
      { href: "/coa", label: { id: "COA", en: "COA" } },
    ],
  },
  {
    key: "monitor",
    title: { id: "Monitor", en: "Monitor" },
    items: [
      { href: "/dashboard", label: { id: "Dashboard", en: "Dashboard" } },
      { href: "/journal", label: { id: "Jurnal", en: "Journal" } },
      { href: "/report", label: { id: "Laporan", en: "Report" } },
    ],
  },
  {
    key: "account",
    title: { id: "Akun", en: "Account" },
    items: [
      { href: "/profile", label: { id: "Profil", en: "Profile" } },
      { href: "/login", label: { id: "Masuk", en: "Login" } },
      { href: "/register", label: { id: "Daftar", en: "Register" } },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const locale = useOfflineStore((state) => state.locale);
  const setLocale = useOfflineStore((state) => state.setLocale);

  const languageOptions = [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English" },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200/70 bg-white/70 px-4 py-6 backdrop-blur-md lg:block">
      <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ERP Suite</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Chicken Banyard</h1>
        <p className="mt-2 text-sm text-slate-600">Sales, purchasing, dan operasional farm dalam satu panel.</p>
      </div>

      <nav aria-label="Main navigation" className="space-y-3">
        {menuSections.map((section) => {
          const isSectionActive = section.items.some((item) => item.href === pathname);
          const sectionTitle = section.title[locale];

          return (
            <details key={section.key} className="group" open={isSectionActive}>
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50">
                <span>{sectionTitle}</span>
                <span className="inline-block text-slate-400 transition group-open:rotate-90">&gt;</span>
              </summary>
              <div className="mt-1 space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const label = item.label[locale];

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-emerald-600 text-white shadow"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
                {section.key === "account" && (
                  <div className="px-3 py-2">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {locale === "id" ? "Bahasa" : "Language"}
                    </p>
                    <Select
                      options={languageOptions}
                      value={locale}
                      onChange={(e) => setLocale(e.target.value as "id" | "en")}
                      className="w-full"
                      placeholder={locale === "id" ? "Pilih bahasa" : "Select language"}
                    />
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}
