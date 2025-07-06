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
    const { data, error } = await supabase.auth.signUp({
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
    <form onSubmit={handleRegister} className="space-y-4">
      <Input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <Input type="text" placeholder="No. WhatsApp" value={wa} onChange={e => setWa(e.target.value)} />
      <Button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</Button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
