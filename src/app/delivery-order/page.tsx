"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/button";
import { useOfflineStore } from "@/lib/offlineStore";

export default function DeliveryOrderPage() {
  const orders = useOfflineStore((state) => state.orders);
  const updateOrderStatus = useOfflineStore((state) => state.updateOrderStatus);
  const locale = useOfflineStore((state) => state.locale);
  const [msg, setMsg] = useState("");

  const deliveryOrders = useMemo(
    () => orders.filter((order) => order.service_method === "antar"),
    [orders],
  );

  const readyToDeliver = useMemo(
    () => deliveryOrders.filter((order) => order.order_status === "paid"),
    [deliveryOrders],
  );

  const deliveredOrders = useMemo(
    () => deliveryOrders.filter((order) => order.order_status === "delivered"),
    [deliveryOrders],
  );

  const handleDelivered = (orderId: string) => {
    updateOrderStatus(orderId, "delivered");
    setMsg(locale === "en"
      ? `Delivery order ${orderId} marked as delivered.`
      : `Delivery order ${orderId} ditandai terkirim.`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "Delivery Order" : "Delivery Order"}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {locale === "en"
              ? "Paid orders enter the delivery queue. This module is for delivery service only."
              : "Order berstatus paid otomatis masuk antrean pengiriman. Modul ini hanya untuk layanan antar."}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">{locale === "en" ? "Ready to Deliver" : "Siap Diantar"}</p>
            <p className="mt-1 text-xl font-semibold text-amber-900">{readyToDeliver.length} {locale === "en" ? "orders" : "order"}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-xs uppercase tracking-wide text-emerald-700">{locale === "en" ? "Delivered" : "Sudah Terkirim"}</p>
            <p className="mt-1 text-xl font-semibold text-emerald-900">{deliveredOrders.length} {locale === "en" ? "orders" : "order"}</p>
          </div>
        </div>

        {msg && <p className="mt-3 text-sm text-emerald-700">{msg}</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{locale === "en" ? "Ready to Deliver" : "Siap Diantar"}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "en" ? "List of paid orders waiting for delivery." : "Daftar order paid yang menunggu pengiriman."}
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {readyToDeliver.length} {locale === "en" ? "orders" : "order"}
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Order ID" : "Order ID"}</th>
                <th className="p-3">{locale === "en" ? "Item" : "Item"}</th>
                <th className="p-3">{locale === "en" ? "Qty" : "Qty"}</th>
                <th className="p-3">{locale === "en" ? "Schedule" : "Jadwal"}</th>
                <th className="p-3">{locale === "en" ? "Address" : "Alamat"}</th>
                <th className="p-3">{locale === "en" ? "Method" : "Metode"}</th>
                <th className="p-3">{locale === "en" ? "Action" : "Aksi"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {readyToDeliver.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={7}>{locale === "en" ? "No delivery orders yet." : "Belum ada delivery order."}</td>
                </tr>
              ) : (
                readyToDeliver.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 align-top">
                    <td className="p-3 font-medium text-slate-900">{order.id}</td>
                    <td className="p-3">{order.item_name}</td>
                    <td className="p-3">{order.quantity} {order.unit}</td>
                    <td className="p-3">{order.delivery_date} {order.delivery_time}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3 uppercase">{order.payment_method}</td>
                    <td className="p-3">
                      <Button type="button" onClick={() => handleDelivered(order.id)} className="px-3 py-1.5 text-xs">
                        {locale === "en" ? "Mark Delivered" : "Tandai Terkirim"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{locale === "en" ? "Delivery History" : "Riwayat Pengiriman"}</h2>
            <p className="mt-1 text-sm text-slate-600">{locale === "en" ? "Orders marked as delivered." : "Order yang sudah ditandai delivered."}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {deliveredOrders.length} {locale === "en" ? "orders" : "order"}
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "Order ID" : "Order ID"}</th>
                <th className="p-3">{locale === "en" ? "Item" : "Item"}</th>
                <th className="p-3">{locale === "en" ? "Qty" : "Qty"}</th>
                <th className="p-3">{locale === "en" ? "Schedule" : "Jadwal"}</th>
                <th className="p-3">{locale === "en" ? "Address" : "Alamat"}</th>
                <th className="p-3">{locale === "en" ? "Status" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {deliveredOrders.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={6}>{locale === "en" ? "No delivered orders yet." : "Belum ada order terkirim."}</td>
                </tr>
              ) : (
                deliveredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 align-top">
                    <td className="p-3 font-medium text-slate-900">{order.id}</td>
                    <td className="p-3">{order.item_name}</td>
                    <td className="p-3">{order.quantity} {order.unit}</td>
                    <td className="p-3">{order.delivery_date} {order.delivery_time}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        Delivered
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
