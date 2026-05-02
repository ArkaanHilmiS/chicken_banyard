"use client";
import { useEffect, useState } from "react";
import { useOfflineStore } from "@/lib/offlineStore";

export default function ProfilePage() {
  const updateCurrentProfile = useOfflineStore((state) => state.updateCurrentProfile);
  const locale = useOfflineStore((state) => state.locale);
  const activeUser = useOfflineStore((state) =>
    state.users.find((user) => user.id === state.currentUserId),
  );
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [capitalAddress, setCapitalAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activeUser) {
      setUsername(activeUser.username || "");
      setWhatsapp(activeUser.whatsapp_number || "");
      setCapitalAddress(activeUser.capital_address || "");
    }
  }, [activeUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateCurrentProfile({
      username,
      whatsappNumber: whatsapp,
      capitalAddress,
    });

    setMessage(result.message);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Edit Profile" : "Edit Profile"}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {locale === "en"
          ? "Update user data for operations and WhatsApp notifications."
          : "Perbarui data pengguna untuk operasional dan notifikasi WhatsApp."}
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input className="block w-full rounded-md border border-slate-300 px-3 py-2" placeholder={locale === "en" ? "Username" : "Username"} value={username} onChange={e => setUsername(e.target.value)} />
        <input className="block w-full rounded-md border border-slate-300 px-3 py-2" placeholder={locale === "en" ? "WhatsApp Number" : "Nomor WhatsApp"} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        <input className="block w-full rounded-md border border-slate-300 px-3 py-2" placeholder={locale === "en" ? "Capital Address" : "Alamat Modal"} value={capitalAddress} onChange={e => setCapitalAddress(e.target.value)} />
        <button className="rounded-md bg-teal-700 px-4 py-2 text-white hover:bg-teal-800" type="submit">{locale === "en" ? "Save" : "Simpan"}</button>
      </form>
      {message && <div className="mt-3 text-sm text-slate-700">{message}</div>}
    </div>
  );
}
