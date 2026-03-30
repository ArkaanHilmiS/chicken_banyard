// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";

export const metadata = {
  title: "Chicken Banyard ERP",
  description: "ERP operasional peternakan dan penjualan telur untuk UMKM modern.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="erp-body min-h-screen">
        <div className="relative flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Navbar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
