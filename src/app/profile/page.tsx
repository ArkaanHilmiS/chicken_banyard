"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [capitalAddress, setCapitalAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update ke Supabase, implementasikan sesuai kebutuhan
    const { error } = await supabase
      .from("users")
      .update({ username, whatsapp_number: whatsapp, capital_address: capitalAddress })
      // TODO: tambahkan filter user_id dari context/auth
      .eq("id", "YOUR_USER_ID");
    if (error) setMessage(error.message);
    else setMessage("Profile updated!");
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Edit Profile</h2>
      <p className="mt-1 text-sm text-slate-600">Perbarui data pengguna untuk operasional dan notifikasi WhatsApp.</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input className="block w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="block w-full rounded-md border border-slate-300 px-3 py-2" placeholder="WhatsApp Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        <input className="block w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Capital Address" value={capitalAddress} onChange={e => setCapitalAddress(e.target.value)} />
        <button className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800" type="submit">Save</button>
      </form>
      {message && <div className="mt-3 text-sm text-slate-700">{message}</div>}
    </div>
  );
}
