"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wa, setWa] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // signup via supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          whatsapp_number: wa,
        },
      },
    });

    if (error) setMsg(error.message);
    else setMsg("Cek email untuk verifikasi!");
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Register User</h1>
      <p className="mt-1 text-sm text-slate-600">Buat akun baru untuk akses dashboard ERP.</p>
      <form onSubmit={handleRegister} className="mt-5 space-y-4">
        <Input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full" />
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full" />
        <Input type="text" placeholder="No. WhatsApp" value={wa} onChange={e => setWa(e.target.value)} className="w-full" />
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Loading..." : "Register"}</Button>
        {msg && <p className="text-sm text-slate-700">{msg}</p>}
      </form>
    </div>
  );
}
