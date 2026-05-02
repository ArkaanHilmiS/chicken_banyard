import { create } from "zustand";
import type { GoodsReceipt } from "@/types/goodsReceipt";
import type { ItemMaster } from "@/types/itemMaster";
import type { Journal } from "@/types/journal";
import type { MasterParty } from "@/types/masterParty";
import type { Order } from "@/types/order";
import type { Payment } from "@/types/payment";
import type { Price } from "@/types/price";
import type { PriceMaster } from "@/types/priceMaster";
import type { Purchase } from "@/types/purchase";
import type { Stock } from "@/types/stock";
import type { UnitOfMeasure } from "@/types/unitOfMeasure";
import type { User } from "@/types/user";
import type { Warehouse } from "@/types/warehouse";

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
  itemMasters: ItemMaster[];
  priceMasters: PriceMaster[];
  unitOfMeasures: UnitOfMeasure[];
  warehouses: Warehouse[];
  users: AuthUser[];
  currentUserId?: string;
  addOrder: (input: {
    itemId: string;
    quantity: number;
    serviceMethod: "antar" | "ambil";
    address: string;
    paymentMethod: Order["payment_method"];
    deliveryDate: string;
    deliveryTime: string;
  }) => void;
  updateOrderStatus: (orderId: string, status: Order["order_status"]) => void;
  addPurchase: (input: { vendorName: string; itemId: string; itemName: string; quantity: number; unit: string; unitPrice: number; category: Purchase["category"] }) => void;
  addGoodsReceipt: (input: { purchaseId?: string; vendorName: string; itemId: string; itemName: string; quantityReceived: number; unit: string; warehouseId: string; condition: GoodsReceipt["condition"] }) => void;
  addPayment: (input: { direction: "incoming" | "outgoing"; amount: number; paymentFor: NonNullable<Payment["payment_for"]>; vendorName?: string; method: Payment["payment_method"]; referenceId?: string }) => void;
  addJournal: (input: { description: string; amount: number; category: Journal["category"]; type: string }) => void;
  addStock: (input: { itemId: string; quantity: number; warehouseId: string; stockType: Stock["stock_type"]; orderId?: string }) => void;
  addWarehouse: (input: { name: string; code: string; location?: string }) => void;
  addPrice: (pricePerKg: number) => void;
  addItemMaster: (input: {
    sku: string;
    name: string;
    category: string;
    defaultUom: string;
    purchasePrice: number;
    sellingPrice: number;
    minStock: number;
    description?: string;
  }) => void;
  addUnitOfMeasure: (input: { name: string; symbol: string; description?: string }) => void;
  addPriceMaster: (input: {
    itemId: string;
    itemName: string;
    uom: string;
    priceType: PriceMaster["price_type"];
    priceValue: number;
    effectiveDate: string;
    paymentMethod?: "cash" | "qris";
    transactionMethod?: "cash-in" | "cash-out" | "transfer" | "hybrid";
  }) => void;
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

const toJournalType = (direction: "incoming" | "outgoing") => (direction === "incoming" ? "cash-in" : "cash-out");

const toJournalCategory = (direction: "incoming" | "outgoing") => (direction === "incoming" ? "pendapatan" : "beban");

const toExpenseCategoryFromPaymentFor = (
  paymentFor: NonNullable<Payment["payment_for"]>,
): Payment["expense_category"] => {
  if (paymentFor === "electricity" || paymentFor === "water") return "utility";
  if (paymentFor === "chicken_feed") return "feed";
  if (paymentFor === "new_chicken") return "livestock";
  if (paymentFor === "asset") return "asset";
  if (paymentFor === "operational") return "operational";
  return "other";
};

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
    item_id: "ITM-001",
    item_name: "Telur Layer Grade A",
    quantity: 120,
    unit: "kg",
    delivery_date: today(),
    delivery_time: "08:00",
    service_method: "antar",
    address: "Toko Kuning",
    payment_method: "cash",
    payment_status: "pending",
    receipt_confirmed: false,
    unit_price_at_order: 31000,
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
  {
    id: "STK-001",
    stock_date: today(),
    item_id: "ITM-001",
    item_name: "Telur Layer Grade A",
    unit: "kg",
    quantity: 1420,
    warehouse_id: "WH-001",
    warehouse_name: "Gudang Telur",
    stock_type: "incoming",
    created_at: nowIso(),
  },
];

const seedPurchases: Purchase[] = [
  {
    id: "PO-001",
    purchase_date: today(),
    vendor_name: "CV Pakan Jaya",
    item_id: "ITM-002",
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
    item_id: "ITM-002",
    item_name: "Pakan Layer",
    quantity_received: 25,
    unit: "sak",
    condition: "good",
    warehouse_id: "WH-002",
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

const seedUnitOfMeasures: UnitOfMeasure[] = [
  { id: "UOM-001", name: "Kilogram", symbol: "kg", is_active: true, created_at: nowIso() },
  { id: "UOM-002", name: "Sak", symbol: "sak", is_active: true, created_at: nowIso() },
  { id: "UOM-003", name: "Paket", symbol: "paket", is_active: true, created_at: nowIso() },
  { id: "UOM-004", name: "Liter", symbol: "liter", is_active: true, created_at: nowIso() },
];

const seedItemMasters: ItemMaster[] = [
  {
    id: "ITM-001",
    sku: "TELUR-LAYER-001",
    name: "Telur Layer Grade A",
    category: "Produk Utama",
    default_uom: "kg",
    purchase_price: 28000,
    selling_price: 31000,
    min_stock: 500,
    description: "Produk telur utama penjualan harian",
    is_active: true,
    created_at: nowIso(),
  },
  {
    id: "ITM-002",
    sku: "PAKAN-LAYER-001",
    name: "Pakan Layer",
    category: "Bahan Baku",
    default_uom: "sak",
    purchase_price: 270000,
    selling_price: 0,
    min_stock: 10,
    description: "Pakan konsumsi ayam petelur",
    is_active: true,
    created_at: nowIso(),
  },
  {
    id: "ITM-003",
    sku: "AIR-MINUM-001",
    name: "Air Minum Ternak",
    category: "Utility",
    default_uom: "liter",
    purchase_price: 500,
    selling_price: 0,
    min_stock: 500,
    description: "Kebutuhan air bersih ternak",
    is_active: true,
    created_at: nowIso(),
  },
];

const seedWarehouses: Warehouse[] = [
  { id: "WH-001", name: "Gudang Telur", code: "GDT", location: "Zona Produksi", is_active: true, created_at: nowIso() },
  { id: "WH-002", name: "Gudang Pakan", code: "GDP", location: "Zona Bahan Baku", is_active: true, created_at: nowIso() },
  { id: "WH-003", name: "Tangki Air", code: "TGA", location: "Zona Utilitas", is_active: true, created_at: nowIso() },
];

const seedPriceMasters: PriceMaster[] = [
  {
    id: "PM-001",
    item_id: "ITM-001",
    item_name: "Telur Layer Grade A",
    uom: "kg",
    price_type: "selling",
    price_value: 31000,
    effective_date: today(),
    payment_method: "cash",
    transaction_method: "cash-in",
    created_at: nowIso(),
  },
  {
    id: "PM-002",
    item_id: "ITM-002",
    item_name: "Pakan Layer",
    uom: "sak",
    price_type: "purchase",
    price_value: 270000,
    effective_date: today(),
    payment_method: "qris",
    transaction_method: "cash-out",
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
  itemMasters: seedItemMasters,
  priceMasters: seedPriceMasters,
  unitOfMeasures: seedUnitOfMeasures,
  warehouses: seedWarehouses,
  users: seedUsers,
  currentUserId: "USR-001",

  addOrder: ({ itemId, quantity, serviceMethod, address, paymentMethod, deliveryDate, deliveryTime }) => {
    const selectedItem = get().itemMasters.find((item) => item.id === itemId);
    if (!selectedItem) return;
    const sellingPriceFromMaster = get().priceMasters.find((price) => price.item_id === itemId && price.price_type === "selling")?.price_value;
    const unitPrice = sellingPriceFromMaster ?? selectedItem.selling_price;

    const newOrder: Order = {
      id: makeId("SO"),
      user_id: get().currentUserId ?? "USR-001",
      order_date: today(),
      item_id: itemId,
      item_name: selectedItem.name,
      quantity,
      unit: selectedItem.default_uom,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      service_method: serviceMethod,
      address,
      payment_method: paymentMethod,
      payment_status: "pending",
      receipt_confirmed: false,
      unit_price_at_order: unitPrice,
      total_price: quantity * unitPrice,
      order_status: "pending",
      payment_id: "",
      created_at: nowIso(),
    };

    const newPayment: Payment = {
      id: makeId("PMT"),
      order_id: newOrder.id,
      payment_date: today(),
      payment_method: paymentMethod,
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

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;

        const paymentStatus = status === "paid"
          ? "paid"
          : status === "cancelled"
            ? "cancelled"
            : order.payment_status;

        return {
          ...order,
          order_status: status,
          payment_status: paymentStatus,
          receipt_confirmed: status === "delivered" ? true : order.receipt_confirmed,
        };
      }),
    }));
  },

  addPurchase: ({ vendorName, itemId, itemName, quantity, unit, unitPrice, category }) => {
    const activeUserId = get().currentUserId ?? "USR-001";
    const total = quantity * unitPrice;
    const newPurchase: Purchase = {
      id: makeId("PO"),
      purchase_date: today(),
      vendor_name: vendorName,
      item_id: itemId,
      item_name: itemName,
      quantity,
      unit,
      unit_price: unitPrice,
      total_price: total,
      category,
      payment_status: "pending",
      created_at: nowIso(),
    };

    const newJournal: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description: `PO ${newPurchase.id} - ${itemName} (${quantity} ${unit})`,
      type: "adjustment",
      amount: total,
      category: "liabilitas",
      ref_table: "purchases",
      ref_id: newPurchase.id,
      user_id: activeUserId,
      created_at: nowIso(),
    };

    set((state) => ({
      purchases: [newPurchase, ...state.purchases],
      journals: [newJournal, ...state.journals],
    }));
  },

  addGoodsReceipt: ({ purchaseId, vendorName, itemId, itemName, quantityReceived, unit, warehouseId, condition }) => {
    const activeUserId = get().currentUserId ?? "USR-001";
    const selectedWarehouse = get().warehouses.find((warehouse) => warehouse.id === warehouseId);
    const newReceipt: GoodsReceipt = {
      id: makeId("GR"),
      receipt_date: today(),
      purchase_id: purchaseId,
      vendor_name: vendorName,
      item_id: itemId,
      item_name: itemName,
      quantity_received: quantityReceived,
      unit,
      condition,
      warehouse_id: warehouseId,
      warehouse_location: selectedWarehouse?.name || "Gudang Utama",
      received_by: "Admin Farm",
      created_at: nowIso(),
    };

    const stockFromReceipt: Stock = {
      id: makeId("STK"),
      stock_date: today(),
      item_id: itemId,
      item_name: itemName,
      unit,
      quantity: quantityReceived,
      warehouse_id: warehouseId,
      warehouse_name: selectedWarehouse?.name || "Gudang Utama",
      stock_type: "incoming",
      created_at: nowIso(),
    };

    const journalFromReceipt: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description: `Barang diterima ${itemName} (${quantityReceived} ${unit})`,
      type: "adjustment",
      amount: 0,
      category: "aset",
      ref_table: "goods_receipts",
      ref_id: newReceipt.id,
      user_id: activeUserId,
      created_at: nowIso(),
    };

    set((state) => ({
      goodsReceipts: [newReceipt, ...state.goodsReceipts],
      stocks: [stockFromReceipt, ...state.stocks],
      journals: [journalFromReceipt, ...state.journals],
      purchases: state.purchases.map((purchase) => {
        if (!purchaseId || purchase.id !== purchaseId) return purchase;
        return {
          ...purchase,
          notes: purchase.notes
            ? `${purchase.notes} | GR: ${newReceipt.id}`
            : `GR: ${newReceipt.id}`,
        };
      }),
    }));
  },

  addPayment: ({ direction, amount, paymentFor, vendorName, method, referenceId }) => {
    const activeUserId = get().currentUserId ?? "USR-001";
    const isIncoming = direction === "incoming";
    const referenceType: Payment["reference_type"] = referenceId
      ? (isIncoming ? "order" : "purchase")
      : "manual";

    const newPayment: Payment = {
      id: makeId("PMT"),
      order_id: isIncoming ? referenceId || "" : "",
      purchase_id: !isIncoming ? referenceId || "" : undefined,
      payment_date: today(),
      payment_method: method,
      payment_direction: direction,
      payment_for: paymentFor,
      expense_category: !isIncoming ? toExpenseCategoryFromPaymentFor(paymentFor) : undefined,
      vendor_name: vendorName,
      reference_type: referenceType,
      reference_id: referenceId,
      is_paid: true,
      amount,
      created_at: nowIso(),
    };

    const newJournal: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description: isIncoming
        ? `Penerimaan pembayaran ${referenceId ? `untuk SO ${referenceId}` : "manual"}`
        : `Pembayaran ${paymentFor}${referenceId ? ` untuk PO ${referenceId}` : ""}`,
      type: toJournalType(direction),
      amount,
      category: toJournalCategory(direction),
      ref_table: "payments",
      ref_id: newPayment.id,
      user_id: activeUserId,
      created_at: nowIso(),
    };

    const stockFromSales: Stock | null = (() => {
      if (!isIncoming || !referenceId) return null;
      const order = get().orders.find((row) => row.id === referenceId);
      if (!order) return null;

      const latestStockForItem = get().stocks.find((row) => row.item_id === order.item_id);
      const selectedWarehouse = latestStockForItem
        ? { id: latestStockForItem.warehouse_id, name: latestStockForItem.warehouse_name }
        : { id: "WH-001", name: "Gudang Telur" };

      return {
        id: makeId("STK"),
        stock_date: today(),
        item_id: order.item_id,
        item_name: order.item_name,
        unit: order.unit,
        quantity: order.quantity,
        warehouse_id: selectedWarehouse.id,
        warehouse_name: selectedWarehouse.name,
        stock_type: "outgoing",
        order_id: order.id,
        created_at: nowIso(),
      };
    })();

    set((state) => ({
      payments: [newPayment, ...state.payments],
      journals: [newJournal, ...state.journals],
      stocks: stockFromSales ? [stockFromSales, ...state.stocks] : state.stocks,
      orders: state.orders.map((order) => {
        if (!isIncoming || !referenceId || order.id !== referenceId) return order;
        return {
          ...order,
          payment_status: "paid",
          order_status: "paid",
          payment_method: method,
          payment_id: newPayment.id,
          receipt_confirmed: true,
        };
      }),
      purchases: state.purchases.map((purchase) => {
        if (isIncoming || !referenceId || purchase.id !== referenceId) return purchase;
        return {
          ...purchase,
          payment_status: "paid",
        };
      }),
      masterParties: state.masterParties.map((party) => {
        if (!vendorName) return party;
        if (party.name.toLowerCase() !== vendorName.toLowerCase()) return party;

        return {
          ...party,
          total_transaction_rp: party.total_transaction_rp + amount,
          transaction_count: party.transaction_count + 1,
          preferred_payment_method: method,
          preferred_transaction_method: isIncoming ? "cash-in" : "cash-out",
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

  addStock: ({ itemId, quantity, warehouseId, stockType, orderId }) => {
    const selectedItem = get().itemMasters.find((item) => item.id === itemId);
    const selectedWarehouse = get().warehouses.find((warehouse) => warehouse.id === warehouseId);
    if (!selectedItem || !selectedWarehouse) return;

    const newStock: Stock = {
      id: makeId("STK"),
      stock_date: today(),
      item_id: itemId,
      item_name: selectedItem.name,
      unit: selectedItem.default_uom,
      quantity,
      warehouse_id: warehouseId,
      warehouse_name: selectedWarehouse.name,
      stock_type: stockType,
      order_id: orderId,
      created_at: nowIso(),
    };

    const newJournal: Journal = {
      id: makeId("JRN"),
      transaction_date: today(),
      description: `Stok ${stockType} ${selectedItem.name} (${quantity} ${selectedItem.default_uom})`,
      type: "adjustment",
      amount: 0,
      category: "aset",
      ref_table: "stocks",
      ref_id: newStock.id,
      user_id: get().currentUserId ?? "USR-001",
      created_at: nowIso(),
    };

    set((state) => ({
      stocks: [newStock, ...state.stocks],
      journals: [newJournal, ...state.journals],
    }));
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

  addItemMaster: ({ sku, name, category, defaultUom, purchasePrice, sellingPrice, minStock, description }) => {
    const newItem: ItemMaster = {
      id: makeId("ITM"),
      sku,
      name,
      category,
      default_uom: defaultUom,
      purchase_price: purchasePrice,
      selling_price: sellingPrice,
      min_stock: minStock,
      description,
      is_active: true,
      created_at: nowIso(),
    };

    set((state) => ({ itemMasters: [newItem, ...state.itemMasters] }));
  },

  addUnitOfMeasure: ({ name, symbol, description }) => {
    const newUom: UnitOfMeasure = {
      id: makeId("UOM"),
      name,
      symbol,
      description,
      is_active: true,
      created_at: nowIso(),
    };

    set((state) => ({ unitOfMeasures: [newUom, ...state.unitOfMeasures] }));
  },

  addWarehouse: ({ name, code, location }) => {
    const newWarehouse: Warehouse = {
      id: makeId("WH"),
      name,
      code,
      location,
      is_active: true,
      created_at: nowIso(),
    };

    set((state) => ({ warehouses: [newWarehouse, ...state.warehouses] }));
  },

  addPriceMaster: ({ itemId, itemName, uom, priceType, priceValue, effectiveDate, paymentMethod, transactionMethod }) => {
    const newPriceMaster: PriceMaster = {
      id: makeId("PM"),
      item_id: itemId,
      item_name: itemName,
      uom,
      price_type: priceType,
      price_value: priceValue,
      effective_date: effectiveDate,
      payment_method: paymentMethod,
      transaction_method: transactionMethod,
      created_at: nowIso(),
    };

    set((state) => ({ priceMasters: [newPriceMaster, ...state.priceMasters] }));
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
