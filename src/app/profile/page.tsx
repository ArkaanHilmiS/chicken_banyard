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
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input className="block mb-2 border px-2 py-1 w-full" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="block mb-2 border px-2 py-1 w-full" placeholder="WhatsApp Number" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        <input className="block mb-2 border px-2 py-1 w-full" placeholder="Capital Address" value={capitalAddress} onChange={e => setCapitalAddress(e.target.value)} />
        <button className="px-4 py-2 bg-blue-500 text-white rounded" type="submit">Save</button>
      </form>
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
}
