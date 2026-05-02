"use client";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useOfflineStore } from "@/lib/offlineStore";

export default function LoginPage() {
  const loginUser = useOfflineStore((state) => state.loginUser);
  const locale = useOfflineStore((state) => state.locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginUser({ email, password });
    setMsg(result.message);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "ERP Login" : "Login ERP"}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {locale === "en" ? "Sign in to access Chicken Banyard operational modules." : "Masuk untuk mengakses modul operasional Chicken Banyard."}
      </p>
      <form onSubmit={handleLogin} className="mt-5 space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Email" : "Email"}</label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={locale === "en" ? "Email" : "Email"} required className="w-full" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Password" : "Password"}</label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={locale === "en" ? "Password" : "Password"} required className="w-full" />
        </div>
        <Button type="submit" className="w-full">{locale === "en" ? "Sign In" : "Login"}</Button>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}
      </form>
    </div>
  );
}
