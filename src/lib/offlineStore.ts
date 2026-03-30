import { create } from "zustand";
import type { GoodsReceipt } from "@/types/goodsReceipt";
import type { Journal } from "@/types/journal";
import type { MasterParty } from "@/types/masterParty";
import type { Order } from "@/types/order";
import type { Payment } from "@/types/payment";
import type { Price } from "@/types/price";
import type { Purchase } from "@/types/purchase";
import type { Stock } from "@/types/stock";
import type { User } from "@/types/user";

type AuthUser = User & { password: string };

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface OfflineStoreState {
  orders: Order[];
  payments: Payment[];
  journals: Journal[];
  stocks: Stock[];
  prices: Price[];
  purchases: Purchase[];
  goodsReceipts: GoodsReceipt[];
  masterParties: MasterParty[];
  users: AuthUser[];
  currentUserId?: string;
  addOrder: (input: { quantityKg: number; serviceMethod: "antar" | "ambil"; address: string }) => void;
  addPurchase: (input: { vendorName: string; itemName: string; quantity: number; unit: string; unitPrice: number; category: Purchase["category"] }) => void;
  addGoodsReceipt: (input: { vendorName: string; itemName: string; quantityReceived: number; unit: string; condition: GoodsReceipt["condition"] }) => void;
  addPayment: (input: { direction: "incoming" | "outgoing"; amount: number; paymentFor: NonNullable<Payment["payment_for"]>; vendorName?: string; method: Payment["payment_method"] }) => void;
  addJournal: (input: { description: string; amount: number; category: Journal["category"]; type: string }) => void;
  addStock: (input: { quantityKg: number; stockType: Stock["stock_type"]; orderId?: string }) => void;
  addPrice: (pricePerKg: number) => void;
  addMasterParty: (input: {
    partyType: MasterParty["party_type"];
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    npwp?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    preferredPaymentMethod?: "cash" | "qris";
    preferredTransactionMethod?: "cash-in" | "cash-out" | "transfer" | "hybrid";
    notes?: string;
  }) => void;
  registerUser: (input: { email: string; password: string; username: string; whatsappNumber: string }) => { ok: boolean; message: string };
  loginUser: (input: { email: string; password: string }) => { ok: boolean; message: string };
  updateCurrentProfile: (input: { username: string; whatsappNumber: string; capitalAddress: string }) => { ok: boolean; message: string };
}

const seedPrices: Price[] = [
  { id: "PR-001", price_date: today(), price_per_kg: 31000, created_at: nowIso() },
  { id: "PR-000", price_date: "2026-03-29", price_per_kg: 30500, created_at: nowIso() },
];

const seedUsers: AuthUser[] = [
  {
    id: "USR-001",
    email: "admin@chicken.local",
    username: "Admin Farm",
    whatsapp_number: "08123456789",
    role: "admin",
    capital_address: "Farm HQ",
    avatar_url: "",
    created_at: nowIso(),
    password: "admin123",
  },
];

const seedOrders: Order[] = [
  {
    id: "SO-240301",
    user_id: "USR-001",
    order_date: today(),
    quantity_kg: 120,
    delivery_date: today(),
    delivery_time: "08:00",
    service_method: "antar",
    address: "Toko Kuning",
    payment_method: "cash",
    payment_status: "pending",
    receipt_confirmed: false,
    price_per_kg_at_order: 31000,
    total_price: 3720000,
    order_status: "pending",
    payment_id: "",
    created_at: nowIso(),
  },
];

const seedPayments: Payment[] = [
  {
    id: "PMT-001",
    order_id: "SO-240301",
    payment_date: today(),
    payment_method: "cash",
    payment_direction: "incoming",
    payment_for: "sales",
    is_paid: false,
    amount: 3720000,
    created_at: nowIso(),
  },
  {
    id: "PMT-002",
    order_id: "",
    payment_date: today(),
    payment_method: "qris",
    payment_direction: "outgoing",
    payment_for: "electricity",
    expense_category: "utility",
    vendor_name: "PLN",
    is_paid: true,
    amount: 850000,
    created_at: nowIso(),
  },
];

const seedJournals: Journal[] = [
  {
    id: "JRN-001",
    transaction_date: today(),
    description: "Penjualan telur SO-240301",
    type: "cash-in",
    amount: 3720000,
    category: "pendapatan",
    ref_table: "orders",
    ref_id: "SO-240301",
    user_id: "USR-001",
    created_at: nowIso(),
  },
  {
    id: "JRN-002",
    transaction_date: today(),
    description: "Pembayaran listrik bulanan",
    type: "cash-out",
    amount: 850000,
    category: "beban",
    ref_table: "payments",
    ref_id: "PMT-002",
    user_id: "USR-001",
    created_at: nowIso(),
  },
];

const seedStocks: Stock[] = [
  { id: "STK-001", stock_date: today(), quantity_kg: 1420, stock_type: "incoming", created_at: nowIso() },
];

const seedPurchases: Purchase[] = [
  {
    id: "PO-001",
    purchase_date: today(),
    vendor_name: "CV Pakan Jaya",
    item_name: "Pakan Layer",
    quantity: 25,
    unit: "sak",
    unit_price: 270000,
    total_price: 6750000,
    category: "feed",
    payment_status: "pending",
    notes: "Kebutuhan 1 minggu",
    created_at: nowIso(),
  },
];

const seedGoodsReceipts: GoodsReceipt[] = [
  {
    id: "GR-001",
    receipt_date: today(),
    purchase_id: "PO-001",
    vendor_name: "CV Pakan Jaya",
    item_name: "Pakan Layer",
    quantity_received: 25,
    unit: "sak",
    condition: "good",
    warehouse_location: "Gudang A",
    received_by: "Admin Farm",
    created_at: nowIso(),
  },
];

const seedMasterParties: MasterParty[] = [
  {
    id: "MST-001",
    party_type: "customer",
    name: "Toko Kuning",
    phone: "081300000001",
    address: "Pasar Tengah",
    preferred_payment_method: "cash",
    preferred_transaction_method: "cash-in",
    total_transaction_rp: 3720000,
    transaction_count: 1,
    created_at: nowIso(),
  },
  {
    id: "MST-002",
    party_type: "supplier",
    name: "CV Pakan Jaya",
    npwp: "01.234.567.8-901.000",
    bank_name: "BCA",
    bank_account_number: "1234567890",
    bank_account_name: "CV Pakan Jaya",
    preferred_payment_method: "qris",
    preferred_transaction_method: "cash-out",
    total_transaction_rp: 6750000,
    transaction_count: 1,
    created_at: nowIso(),
  },
];

export const useOfflineStore = create<OfflineStoreState>((set, get) => ({
  orders: seedOrders,
  payments: seedPayments,
  journals: seedJournals,
  stocks: seedStocks,
  prices: seedPrices,
  purchases: seedPurchases,
  goodsReceipts: seedGoodsReceipts,
  masterParties: seedMasterParties,
  users: seedUsers,
  currentUserId: "USR-001",

  addOrder: ({ quantityKg, serviceMethod, address }) => {
    const latestPrice = get().prices[0]?.price_per_kg ?? 30000;
    const newOrder: Order = {
      id: makeId("SO"),
      user_id: get().currentUserId ?? "USR-001",
      order_date: today(),
      quantity_kg: quantityKg,
      delivery_date: today(),
      delivery_time: "09:00",
      service_method: serviceMethod,
      address,
      payment_method: "cash",
      payment_status: "pending",
      receipt_confirmed: false,
      price_per_kg_at_order: latestPrice,
      total_price: quantityKg * latestPrice,
      order_status: "pending",
      payment_id: "",
      created_at: nowIso(),
    };

    const newPayment: Payment = {
      id: makeId("PMT"),
      order_id: newOrder.id,
      payment_date: today(),
      payment_method: "cash",
      payment_direction: "incoming",
      payment_for: "sales",
      is_paid: false,
      amount: newOrder.total_price,
      created_at: nowIso(),
    };

    const newJournal: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description: `Order baru ${newOrder.id}`,
      type: "cash-in",
      amount: newOrder.total_price,
      category: "pendapatan",
      ref_table: "orders",
      ref_id: newOrder.id,
      user_id: newOrder.user_id,
      created_at: nowIso(),
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      payments: [newPayment, ...state.payments],
      journals: [newJournal, ...state.journals],
    }));
  },

  addPurchase: ({ vendorName, itemName, quantity, unit, unitPrice, category }) => {
    const total = quantity * unitPrice;
    const newPurchase: Purchase = {
      id: makeId("PO"),
      purchase_date: today(),
      vendor_name: vendorName,
      item_name: itemName,
      quantity,
      unit,
      unit_price: unitPrice,
      total_price: total,
      category,
      payment_status: "pending",
      created_at: nowIso(),
    };

    set((state) => ({ purchases: [newPurchase, ...state.purchases] }));
  },

  addGoodsReceipt: ({ vendorName, itemName, quantityReceived, unit, condition }) => {
    const newReceipt: GoodsReceipt = {
      id: makeId("GR"),
      receipt_date: today(),
      vendor_name: vendorName,
      item_name: itemName,
      quantity_received: quantityReceived,
      unit,
      condition,
      warehouse_location: "Gudang A",
      received_by: "Admin Farm",
      created_at: nowIso(),
    };

    set((state) => ({
      goodsReceipts: [newReceipt, ...state.goodsReceipts],
      stocks: [
        {
          id: makeId("STK"),
          stock_date: today(),
          quantity_kg: quantityReceived,
          stock_type: "incoming",
          created_at: nowIso(),
        },
        ...state.stocks,
      ],
    }));
  },

  addPayment: ({ direction, amount, paymentFor, vendorName, method }) => {
    const newPayment: Payment = {
      id: makeId("PMT"),
      order_id: direction === "incoming" ? makeId("SO") : "",
      payment_date: today(),
      payment_method: method,
      payment_direction: direction,
      payment_for: paymentFor,
      expense_category: direction === "outgoing" ? "operational" : undefined,
      vendor_name: vendorName,
      is_paid: true,
      amount,
      created_at: nowIso(),
    };

    const newJournal: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description: direction === "incoming" ? "Penerimaan pembayaran" : `Pembayaran ${paymentFor}`,
      type: direction === "incoming" ? "cash-in" : "cash-out",
      amount,
      category: direction === "incoming" ? "pendapatan" : "beban",
      ref_table: "payments",
      ref_id: newPayment.id,
      user_id: get().currentUserId ?? "USR-001",
      created_at: nowIso(),
    };

    set((state) => ({
      payments: [newPayment, ...state.payments],
      journals: [newJournal, ...state.journals],
      masterParties: state.masterParties.map((party) => {
        if (!vendorName) return party;
        if (party.name.toLowerCase() !== vendorName.toLowerCase()) return party;

        return {
          ...party,
          total_transaction_rp: party.total_transaction_rp + amount,
          transaction_count: party.transaction_count + 1,
          preferred_payment_method: method,
          preferred_transaction_method: direction === "incoming" ? "cash-in" : "cash-out",
        };
      }),
    }));
  },

  addJournal: ({ description, amount, category, type }) => {
    const newJournal: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description,
      type,
      amount,
      category,
      user_id: get().currentUserId ?? "USR-001",
      created_at: nowIso(),
    };

    set((state) => ({ journals: [newJournal, ...state.journals] }));
  },

  addStock: ({ quantityKg, stockType, orderId }) => {
    const newStock: Stock = {
      id: makeId("STK"),
      stock_date: today(),
      quantity_kg: quantityKg,
      stock_type: stockType,
      order_id: orderId,
      created_at: nowIso(),
    };

    set((state) => ({ stocks: [newStock, ...state.stocks] }));
  },

  addPrice: (pricePerKg) => {
    const newPrice: Price = {
      id: makeId("PR"),
      price_date: today(),
      price_per_kg: pricePerKg,
      created_at: nowIso(),
    };

    set((state) => ({ prices: [newPrice, ...state.prices] }));
  },

  addMasterParty: ({
    partyType,
    name,
    email,
    phone,
    address,
    npwp,
    bankName,
    bankAccountNumber,
    bankAccountName,
    preferredPaymentMethod,
    preferredTransactionMethod,
    notes,
  }) => {
    const newParty: MasterParty = {
      id: makeId("MST"),
      party_type: partyType,
      name,
      email,
      phone,
      address,
      npwp,
      bank_name: bankName,
      bank_account_number: bankAccountNumber,
      bank_account_name: bankAccountName,
      preferred_payment_method: preferredPaymentMethod,
      preferred_transaction_method: preferredTransactionMethod,
      total_transaction_rp: 0,
      transaction_count: 0,
      notes,
      created_at: nowIso(),
    };

    set((state) => ({ masterParties: [newParty, ...state.masterParties] }));
  },

  registerUser: ({ email, password, username, whatsappNumber }) => {
    const exists = get().users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) return { ok: false, message: "Email sudah terdaftar." };

    const newUser: AuthUser = {
      id: makeId("USR"),
      email,
      username,
      whatsapp_number: whatsappNumber,
      role: "user",
      created_at: nowIso(),
      password,
      capital_address: "",
      avatar_url: "",
    };

    set((state) => ({ users: [newUser, ...state.users], currentUserId: newUser.id }));
    return { ok: true, message: "Register berhasil (mode offline)." };
  },

  loginUser: ({ email, password }) => {
    const found = get().users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (!found) return { ok: false, message: "Akun tidak ditemukan." };
    if (found.password !== password) return { ok: false, message: "Password salah." };

    set({ currentUserId: found.id });
    return { ok: true, message: `Login berhasil sebagai ${found.username}.` };
  },

  updateCurrentProfile: ({ username, whatsappNumber, capitalAddress }) => {
    const activeId = get().currentUserId;
    if (!activeId) return { ok: false, message: "Belum ada user login." };

    set((state) => ({
      users: state.users.map((user) =>
        user.id === activeId
          ? {
              ...user,
              username,
              whatsapp_number: whatsappNumber,
              capital_address: capitalAddress,
            }
          : user,
      ),
    }));

    return { ok: true, message: "Profil berhasil diperbarui (sementara/offline)." };
  },
}));
