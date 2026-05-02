"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuSections = [
  {
    title: "Beranda",
    items: [
      { href: "/", label: "Overview" },
    ],
  },
  {
    title: "Bisnis",
    items: [
      { href: "/order", label: "Sales Order" },
      { href: "/payment", label: "Payment" },
      { href: "/delivery-order", label: "Delivery Order" },
      { href: "/procurement", label: "Procurement" },
      { href: "/goods-receipt", label: "Goods Receipt" },
      { href: "/stock", label: "Inventory" },
      { href: "/price", label: "Pricing" },
    ],
  },
  {
    title: "Konfig",
    items: [
      { href: "/master-data", label: "Master Data" },
      { href: "/item-master", label: "Item Master" },
      { href: "/price-master", label: "Price Master" },
      { href: "/uom-master", label: "UoM Master" },
      { href: "/coa", label: "COA" },
    ],
  },
  {
    title: "Monitor",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/journal", label: "Journal" },
      { href: "/report", label: "Report" },
    ],
  },
  {
    title: "Akun",
    items: [
      { href: "/profile", label: "Profile" },
      { href: "/login", label: "Login" },
      { href: "/register", label: "Register" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

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

          return (
            <details key={section.title} className="group" open={isSectionActive}>
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-50">
                <span>{section.title}</span>
                <span className="inline-block text-slate-400 transition group-open:rotate-90">&gt;</span>
              </summary>
              <div className="mt-1 space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;

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
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          );
        })}
      </nav>
    </aside>
  );
}
