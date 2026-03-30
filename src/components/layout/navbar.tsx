"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const activePage = pathname === "/" ? "Overview" : pathname.replace("/", "");
  const now = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations Center</p>
          <h2 className="text-xl font-semibold capitalize text-slate-900">{activePage}</h2>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">Admin Farm</p>
          <p className="text-xs text-slate-500">{now}</p>
        </div>
      </div>
    </header>
  );
}
