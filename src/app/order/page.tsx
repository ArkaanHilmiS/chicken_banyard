"use client";
import { useMemo, useState } from "react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { nextSequenceNumber, useOfflineStore } from "@/lib/offlineStore";

export default function OrderPage() {
  const addOrder = useOfflineStore((state) => state.addOrder);
  const updateOrderStatus = useOfflineStore((state) => state.updateOrderStatus);
  const orders = useOfflineStore((state) => state.orders);
  const purchases = useOfflineStore((state) => state.purchases);
  const goodsReceipts = useOfflineStore((state) => state.goodsReceipts);
  const stocks = useOfflineStore((state) => state.stocks);
  const parties = useOfflineStore((state) => state.masterParties);
  const itemMasters = useOfflineStore((state) => state.itemMasters);
  const priceMasters = useOfflineStore((state) => state.priceMasters);
  const locale = useOfflineStore((state) => state.locale);
  const numberLocale = locale === "en" ? "en-US" : "id-ID";
  const nextSoNumber = useMemo(() => nextSequenceNumber("SO", orders), [orders]);
    const serviceMethods = [
      { value: "antar", label: locale === "en" ? "Delivery" : "Antar" },
      { value: "ambil", label: locale === "en" ? "Pick Up" : "Ambil Sendiri" },
    ];
  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");
  const [serviceMethod, setServiceMethod] = useState<"antar" | "ambil" | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "cash" | "">("");
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().slice(0, 10));
  const [deliveryTime, setDeliveryTime] = useState("09:00");
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");

  const orderStatusOptions = [
    { value: "pending", label: locale === "en" ? "Pending" : "Pending" },
    { value: "delivered", label: locale === "en" ? "Delivered" : "Terkirim" },
    { value: "cancelled", label: locale === "en" ? "Cancelled" : "Dibatalkan" },
  ];

  const paymentMethodOptions = [
    { value: "cash", label: locale === "en" ? "Cash" : "Tunai" },
    { value: "qris", label: "QRIS" },
  ];

  const itemOptions = useMemo(
    () => itemMasters
      .filter((item) => item.is_active)
      .map((item) => ({ value: item.id, label: `${item.sku} - ${item.name}` })),
    [itemMasters],
  );

  const selectedItem = useMemo(
    () => itemMasters.find((item) => item.id === itemId),
    [itemMasters, itemId],
  );

  const receivedByPurchase = useMemo(() => {
    const summary = new Map<string, number>();
    for (const receipt of goodsReceipts) {
      if (!receipt.purchase_id) continue;
      summary.set(receipt.purchase_id, (summary.get(receipt.purchase_id) || 0) + receipt.quantity_received);
    }
    return summary;
  }, [goodsReceipts]);

  const orderedByItem = useMemo(() => {
    const summary = new Map<string, number>();
    for (const purchase of purchases) {
      const received = purchase.id ? receivedByPurchase.get(purchase.id) || 0 : 0;
      const remaining = Math.max(0, purchase.quantity - received);
      if (remaining <= 0) continue;
      summary.set(purchase.item_id, (summary.get(purchase.item_id) || 0) + remaining);
    }
    return summary;
  }, [purchases, receivedByPurchase]);

  const committedByItem = useMemo(() => {
    const summary = new Map<string, number>();
    for (const order of orders) {
      if (order.order_status === "cancelled" || order.order_status === "delivered") continue;
      summary.set(order.item_id, (summary.get(order.item_id) || 0) + order.quantity);
    }
    return summary;
  }, [orders]);

  const onHandByItem = useMemo(() => {
    const summary = new Map<string, number>();
    for (const stock of stocks) {
      const signedQty = stock.stock_type === "outgoing" ? -stock.quantity : stock.quantity;
      summary.set(stock.item_id, (summary.get(stock.item_id) || 0) + signedQty);
    }
    return summary;
  }, [stocks]);

  const currentUnitPrice = useMemo(() => {
    if (!selectedItem) return 0;
    const sellingPriceFromMaster = priceMasters.find((row) => row.item_id === selectedItem.id && row.price_type === "selling")?.price_value;
    return sellingPriceFromMaster ?? selectedItem.selling_price;
  }, [selectedItem, priceMasters]);

  const availableStock = useMemo(() => {
    if (!selectedItem) return 0;
    const onHand = onHandByItem.get(selectedItem.id) || 0;
    const ordered = orderedByItem.get(selectedItem.id) || 0;
    const committed = committedByItem.get(selectedItem.id) || 0;
    return onHand - committed + ordered;
  }, [selectedItem, onHandByItem, orderedByItem, committedByItem]);

  const estimatedTotal = useMemo(() => Number(qty || 0) * currentUnitPrice, [qty, currentUnitPrice]);

  const customerOptions = useMemo(
    () => parties
      .filter((party) => party.is_active && party.party_type === "customer")
      .map((party) => ({ value: party.id, label: party.name })),
    [parties],
  );

  const onCustomerChange = (value: string) => {
    setCustomerId(value);
    const selectedCustomer = parties.find((party) => party.id === value);
    if (selectedCustomer?.address) {
      setAddress(selectedCustomer.address);
    }
    if (selectedCustomer?.preferred_payment_method) {
      setPaymentMethod(selectedCustomer.preferred_payment_method);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi sederhana
    if (!itemId || !qty || !serviceMethod || !address || !paymentMethod || !deliveryDate || !deliveryTime) {
      setMsg(locale === "en" ? "All fields are required." : "Semua field wajib diisi");
      return;
    }
    const result = addOrder({
      itemId,
      quantity: Number(qty),
      serviceMethod,
      address,
      paymentMethod,
      deliveryDate,
      deliveryTime,
    });
    if (!result.ok) {
      setMsg(result.message);
      return;
    }

    setMsg(result.message);
    setCustomerId("");
    setItemId("");
    setQty("");
    setServiceMethod("");
    setPaymentMethod("");
    setDeliveryDate(new Date().toISOString().slice(0, 10));
    setDeliveryTime("09:00");
    setAddress("");
  };

  const handleStatusChange = (orderId: string, status: "pending" | "cancelled" | "delivered") => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <h1 className="text-xl font-semibold text-slate-900">{locale === "en" ? "New Sales Order" : "Sales Order Baru"}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en"
            ? "Enter customer order details. New orders start as pending and can be updated as operations progress."
            : "Input detail pesanan pelanggan. Status awal pending dan dapat diubah untuk progress operasional."}
        </p>

        <form onSubmit={handleOrder} className="mt-5 space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "SO Number" : "No. SO"}</label>
            <Input
              type="text"
              value={nextSoNumber}
              readOnly
              className="w-full bg-slate-50 text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Customer" : "Pelanggan"}</label>
            <Select
              options={customerOptions}
              value={customerId}
              onChange={(e) => onCustomerChange(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Item" : "Item"}</label>
            <Select
              options={itemOptions}
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Quantity" : "Jumlah"}</label>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder={locale === "en" ? `Quantity (${selectedItem?.default_uom || "unit"})` : `Jumlah (${selectedItem?.default_uom || "unit"})`}
              required
              min={1}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Service Method" : "Metode Layanan"}</label>
            <Select
              options={serviceMethods}
              value={serviceMethod}
              onChange={(e) => setServiceMethod(e.target.value as "antar" | "ambil" | "")}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Payment Method" : "Metode Pembayaran"}</label>
            <Select
              options={paymentMethodOptions}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as "qris" | "cash" | "")}
              required
              className="w-full"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Delivery Date" : "Tanggal Kirim"}</label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Delivery Time" : "Jam Kirim"}</label>
              <Input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">{locale === "en" ? "Address" : "Alamat"}</label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={locale === "en" ? "Full address" : "Alamat lengkap"}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">{locale === "en" ? "Save Order" : "Simpan Order"}</Button>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
            <p>{locale === "en" ? "Unit Price" : "Harga Satuan"}: Rp {currentUnitPrice.toLocaleString(numberLocale)}</p>
            <p>{locale === "en" ? "Available Stock" : "Stok Tersedia"}: {selectedItem ? `${availableStock} ${selectedItem.default_uom}` : "-"}</p>
            <p className="font-semibold">{locale === "en" ? "Total Price" : "Total Harga"}: Rp {estimatedTotal.toLocaleString(numberLocale)}</p>
          </div>
          {msg && (
            <div className={`mt-2 text-sm ${msg.toLowerCase().includes("success") || msg.toLowerCase().includes("berhasil") ? "text-emerald-700" : "text-red-600"}`}>
              {msg}
            </div>
          )}
        </form>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">{locale === "en" ? "Status Notes" : "Catatan Status"}</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>{locale === "en" ? "New orders start as Pending." : "Order baru otomatis berstatus Pending."}</li>
          <li>{locale === "en" ? "Paid status can only be changed in the Payment module." : "Status Paid hanya bisa diubah lewat modul Payment."}</li>
          <li>{locale === "en" ? "Delivery can be marked only after payment is recorded." : "Delivery hanya bisa ditandai setelah pembayaran tercatat."}</li>
        </ul>
      </aside>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
        <h2 className="text-lg font-semibold text-slate-900">{locale === "en" ? "Sales Order Details" : "Detail Pesanan Sales"}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {locale === "en"
            ? "Track order details and update status based on field operations."
            : "Pantau detail order dan update status kapan saja sesuai proses lapangan."}
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-y border-slate-200 bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="p-3">{locale === "en" ? "SO No" : "No. SO"}</th>
                <th className="p-3">{locale === "en" ? "Order Date" : "Tanggal Order"}</th>
                <th className="p-3">{locale === "en" ? "Details" : "Detail"}</th>
                <th className="p-3">{locale === "en" ? "Service" : "Layanan"}</th>
                <th className="p-3">{locale === "en" ? "Delivery" : "Pengiriman"}</th>
                <th className="p-3">{locale === "en" ? "Payment" : "Pembayaran"}</th>
                <th className="p-3">{locale === "en" ? "Status" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={7}>{locale === "en" ? "No sales orders yet." : "Belum ada pesanan sales."}</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 align-top">
                    <td className="p-3 font-medium text-slate-900">{order.so_number || order.id}</td>
                    <td className="p-3">{order.order_date}</td>
                    <td className="p-3">
                      <div>{order.item_name}</div>
                      <div>{order.quantity} {order.unit} x Rp {order.unit_price_at_order.toLocaleString(numberLocale)}</div>
                      <div className="text-slate-500">{locale === "en" ? "Total" : "Total"}: Rp {order.total_price.toLocaleString(numberLocale)}</div>
                      <div className="text-slate-500">{locale === "en" ? "Address" : "Alamat"}: {order.address}</div>
                    </td>
                    <td className="p-3 capitalize">{order.service_method === "antar" ? (locale === "en" ? "delivery" : "antar") : (locale === "en" ? "pickup" : "ambil")}</td>
                    <td className="p-3">{order.delivery_date} {order.delivery_time}</td>
                    <td className="p-3 uppercase">{order.payment_method}</td>
                    <td className="p-3">
                      <Select
                        options={orderStatusOptions.filter((option) =>
                          option.value !== "delivered" || order.payment_status === "paid" || order.order_status === "delivered",
                        )}
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as "pending" | "cancelled" | "delivered")}
                        className="w-full"
                      />
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
