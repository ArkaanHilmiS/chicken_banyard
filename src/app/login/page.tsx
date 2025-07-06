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
    <form onSubmit={handleLogin} className="space-y-3 max-w-md mx-auto mt-10">
      <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <Button type="submit">Login</Button>
      {msg && <div>{msg}</div>}
    </form>
  );
}
