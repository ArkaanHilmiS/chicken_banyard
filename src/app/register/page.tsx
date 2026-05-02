"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useOfflineStore } from "@/lib/offlineStore";

export default function RegisterPage() {
  const registerUser = useOfflineStore((state) => state.registerUser);
  const locale = useOfflineStore((state) => state.locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wa, setWa] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = registerUser({
      email,
      password,
      username,
      whatsappNumber: wa,
    });

    setMsg(result.message);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Register User" : "Register User"}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {locale === "en" ? "Create a new account for ERP dashboard access." : "Buat akun baru untuk akses dashboard ERP."}
      </p>
      <form onSubmit={handleRegister} className="mt-5 space-y-4">
        <Input type="text" placeholder={locale === "en" ? "Username" : "Username"} value={username} onChange={e => setUsername(e.target.value)} className="w-full" />
        <Input type="email" placeholder={locale === "en" ? "Email" : "Email"} value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
        <Input type="password" placeholder={locale === "en" ? "Password" : "Password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full" />
        <Input type="text" placeholder={locale === "en" ? "WhatsApp Number" : "No. WhatsApp"} value={wa} onChange={e => setWa(e.target.value)} className="w-full" />
        <Button type="submit" disabled={loading} className="w-full">{loading ? (locale === "en" ? "Loading..." : "Memuat...") : (locale === "en" ? "Register" : "Daftar")}</Button>
        {msg && <p className="text-sm text-slate-700">{msg}</p>}
      </form>
    </div>
  );
}
