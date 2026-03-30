"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMsg(error ? error.message : "Login berhasil!");
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Login ERP</h1>
      <p className="mt-1 text-sm text-slate-600">Masuk untuk mengakses modul operasional Chicken Banyard.</p>
      <form onSubmit={handleLogin} className="mt-5 space-y-3">
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full" />
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full" />
        <Button type="submit" className="w-full">Login</Button>
        {msg && <div className="text-sm text-slate-700">{msg}</div>}
      </form>
    </div>
  );
}
