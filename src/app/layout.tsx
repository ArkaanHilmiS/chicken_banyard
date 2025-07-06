// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Chicken Banyard | Penjualan Telur Modern",
  description: "Sistem manajemen & penjualan telur berbasis web untuk UMKM dan peternak.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <header className="w-full bg-white shadow-sm sticky top-0 z-10">
          <nav className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
              🐣 Chicken Banyard
            </Link>
            <div className="flex gap-4">
              <Link href="/order" className="hover:underline text-blue-700">Order</Link>
              <Link href="/login" className="hover:underline text-blue-700">Login</Link>
              <Link href="/register" className="hover:underline text-green-700">Register</Link>
              <Link href="/report" className="hover:underline text-indigo-700">Report</Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-3xl mx-auto p-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full bg-gray-100 text-center py-4 mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Chicken Banyard. Powered by Next.js, Tailwind, Supabase.
        </footer>
      </body>
    </html>
  );
}
