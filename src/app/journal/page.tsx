"use client";
import { useOfflineStore } from "@/lib/offlineStore";

export default function JournalPage() {
  const journals = useOfflineStore((state) => state.journals);
  const addJournal = useOfflineStore((state) => state.addJournal);

  const operationalExpenseKeywords = ["listrik", "air", "pakan", "ayam", "operasional"];

  const handleAddJournal = () => {
    addJournal({
      description: "Biaya pakan harian",
      amount: 320000,
      category: "beban",
      type: "cash-out",
    });
  };

  const expenseRows = journals.filter((j) => j.category === "beban");
  const operationalRows = journals.filter((j) => {
    const text = `${j.description} ${j.type}`.toLowerCase();
    return operationalExpenseKeywords.some((keyword) => text.includes(keyword));
  });

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Journal Ledger</h1>
            <p className="mt-1 text-sm text-slate-600">Pencatatan jurnal sementara berjalan di memory offline.</p>
          </div>
          <button onClick={handleAddJournal} className="rounded-md bg-teal-700 px-3 py-2 text-sm font-medium text-white hover:bg-teal-800">+ Tambah Jurnal</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-600">Total Beban</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{expenseRows.length} entry</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">Operasional Utility dan Feed</p>
            <p className="mt-1 text-xl font-semibold text-amber-900">{operationalRows.length} entry</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3">Jenis Arus</th>
                <th className="p-3">Kategori Akun</th>
                <th className="p-3">Nominal</th>
                <th className="p-3">User</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {journals.map((j) => (
                <tr key={j.id} className="border-b border-slate-100">
                  <td className="p-3">{j.transaction_date}</td>
                  <td className="p-3">{j.description}</td>
                  <td className="p-3 capitalize">{j.type}</td>
                  <td className="p-3">{j.category}</td>
                  <td className="p-3">{j.amount}</td>
                  <td className="p-3">{j.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
