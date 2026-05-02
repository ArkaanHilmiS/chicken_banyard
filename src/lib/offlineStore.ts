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
import type { ChartOfAccount } from "@/types/coa";

type AuthUser = User & { password: string };

const nowIso = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const DEFAULT_EGG_SKU = "TLR01";
const DEFAULT_EGG_NAME = "Telur Ayam Negeri";
const DEFAULT_EGG_UOM = "kg";
const DEFAULT_EGG_CATEGORY = "Produk Utama";
const DEFAULT_EGG_MIN_STOCK = 300;

const toSequenceNumber = (prefix: "SO" | "PO", value: number) => `${prefix}${String(value).padStart(10, "0")}`;

const nextSequenceNumber = (prefix: "SO" | "PO", items: Array<{ so_number?: string; po_number?: string }>) => {
  const max = items.reduce((acc, item) => {
    const raw = prefix === "SO" ? item.so_number : item.po_number;
    if (!raw || !raw.startsWith(prefix)) return acc;
    const numeric = Number(raw.slice(prefix.length));
    if (Number.isNaN(numeric)) return acc;
    return Math.max(acc, numeric);
  }, 0);

  return toSequenceNumber(prefix, max + 1);
};

const latestPricePerKg = (prices: Price[]) => prices[0]?.price_per_kg ?? 0;

const buildDefaultEggItem = (sellingPrice: number): ItemMaster => ({
  id: makeId("ITM"),
  sku: DEFAULT_EGG_SKU,
  name: DEFAULT_EGG_NAME,
  category: DEFAULT_EGG_CATEGORY,
  default_uom: DEFAULT_EGG_UOM,
  purchase_price: sellingPrice,
  selling_price: sellingPrice,
  min_stock: DEFAULT_EGG_MIN_STOCK,
  is_active: true,
  created_at: nowIso(),
});

interface OfflineStoreState {
  orders: Order[];
  payments: Payment[];
  journals: Journal[];
  stocks: Stock[];
  prices: Price[];
  purchases: Purchase[];
  goodsReceipts: GoodsReceipt[];
  chartOfAccounts: ChartOfAccount[];
  masterParties: MasterParty[];
  itemMasters: ItemMaster[];
  priceMasters: PriceMaster[];
  unitOfMeasures: UnitOfMeasure[];
  warehouses: Warehouse[];
  users: AuthUser[];
  currentUserId?: string;
  locale: "id" | "en";
  setLocale: (locale: "id" | "en") => void;
  addOrder: (input: {
    itemId: string;
    quantity: number;
    serviceMethod: "antar" | "ambil";
    address: string;
    paymentMethod: Order["payment_method"];
    deliveryDate: string;
    deliveryTime: string;
  }) => { ok: boolean; message: string };
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
    isActive?: boolean;
  }) => void;
  toggleItemMaster: (itemId: string) => void;
  addUnitOfMeasure: (input: { name: string; symbol: string; description?: string; isActive?: boolean }) => void;
  toggleUnitOfMeasure: (uomId: string) => void;
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
  addChartOfAccount: (input: { code: string; name: string; category: ChartOfAccount["category"]; isActive?: boolean }) => { ok: boolean; message: string };
  toggleChartOfAccount: (accountId: string) => void;
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
    isActive?: boolean;
  }) => void;
  toggleMasterParty: (partyId: string) => void;
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

const seedPrices: Price[] = [];

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

const seedOrders: Order[] = [];

const seedPayments: Payment[] = [];

const seedJournals: Journal[] = [];

const seedStocks: Stock[] = [];

const seedPurchases: Purchase[] = [];

const seedGoodsReceipts: GoodsReceipt[] = [];

const seedChartOfAccounts: ChartOfAccount[] = [
  { id: "COA-1101", code: "1101", name: "Kas", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1102", code: "1102", name: "Bank", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1201", code: "1201", name: "Piutang Usaha", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1301", code: "1301", name: "Persediaan Telur", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1302", code: "1302", name: "Persediaan Pakan", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1303", code: "1303", name: "Persediaan Bahan" , category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1401", code: "1401", name: "Biaya Dibayar Dimuka", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1501", code: "1501", name: "Aset Tetap", category: "aset", is_active: true, created_at: nowIso() },
  { id: "COA-1502", code: "1502", name: "Akumulasi Penyusutan", category: "aset", is_active: true, created_at: nowIso() },

  { id: "COA-2101", code: "2101", name: "Utang Usaha", category: "liabilitas", is_active: true, created_at: nowIso() },
  { id: "COA-2102", code: "2102", name: "Utang Pajak", category: "liabilitas", is_active: true, created_at: nowIso() },
  { id: "COA-2103", code: "2103", name: "Utang Gaji", category: "liabilitas", is_active: true, created_at: nowIso() },
  { id: "COA-2104", code: "2104", name: "Pendapatan Diterima Dimuka", category: "liabilitas", is_active: true, created_at: nowIso() },

  { id: "COA-3101", code: "3101", name: "Modal Pemilik", category: "modal", is_active: true, created_at: nowIso() },
  { id: "COA-3201", code: "3201", name: "Laba Ditahan", category: "modal", is_active: true, created_at: nowIso() },

  { id: "COA-4101", code: "4101", name: "Penjualan Telur", category: "pendapatan", is_active: true, created_at: nowIso() },
  { id: "COA-4102", code: "4102", name: "Pendapatan Lainnya", category: "pendapatan", is_active: true, created_at: nowIso() },

  { id: "COA-5101", code: "5101", name: "Beban Pakan", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5102", code: "5102", name: "Beban Listrik & Air", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5103", code: "5103", name: "Beban Tenaga Kerja", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5104", code: "5104", name: "Beban Pengiriman", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5105", code: "5105", name: "Beban Perawatan", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5106", code: "5106", name: "Beban Penyusutan", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5107", code: "5107", name: "Beban Administrasi", category: "beban", is_active: true, created_at: nowIso() },
  { id: "COA-5108", code: "5108", name: "Beban Pemasaran", category: "beban", is_active: true, created_at: nowIso() },
];

const seedMasterParties: MasterParty[] = [];

const seedUnitOfMeasures: UnitOfMeasure[] = [
  { id: "UOM-001", name: "Kilogram", symbol: "kg", description: "Default weight unit", is_active: true, created_at: nowIso() },
];

const seedItemMasters: ItemMaster[] = [buildDefaultEggItem(latestPricePerKg(seedPrices))];

const seedWarehouses: Warehouse[] = [
  { id: "WH-001", name: "Gudang Telur", code: "GDT", location: "Zona Produksi", is_active: true, created_at: nowIso() },
  { id: "WH-002", name: "Gudang Pakan", code: "GDP", location: "Zona Bahan Baku", is_active: true, created_at: nowIso() },
  { id: "WH-003", name: "Tangki Air", code: "TGA", location: "Zona Utilitas", is_active: true, created_at: nowIso() },
];

const seedPriceMasters: PriceMaster[] = [];

export const useOfflineStore = create<OfflineStoreState>((set, get) => ({
  orders: seedOrders,
  payments: seedPayments,
  journals: seedJournals,
  stocks: seedStocks,
  prices: seedPrices,
  purchases: seedPurchases,
  goodsReceipts: seedGoodsReceipts,
  chartOfAccounts: seedChartOfAccounts,
  masterParties: seedMasterParties,
  itemMasters: seedItemMasters,
  priceMasters: seedPriceMasters,
  unitOfMeasures: seedUnitOfMeasures,
  warehouses: seedWarehouses,
  users: seedUsers,
  currentUserId: "USR-001",
  locale: "id",

  setLocale: (locale) => set({ locale }),

  addOrder: ({ itemId, quantity, serviceMethod, address, paymentMethod, deliveryDate, deliveryTime }) => {
    const locale = get().locale;
    const selectedItem = get().itemMasters.find((item) => item.id === itemId);
    if (!selectedItem || !selectedItem.is_active) {
      return {
        ok: false,
        message: locale === "en" ? "Active item not found." : "Item aktif tidak ditemukan.",
      };
    }

    const onHand = get().stocks.reduce((sum, stock) => {
      if (stock.item_id !== itemId) return sum;
      const signedQty = stock.stock_type === "outgoing" ? -stock.quantity : stock.quantity;
      return sum + signedQty;
    }, 0);

    const committed = get().orders.reduce((sum, order) => {
      if (order.item_id !== itemId) return sum;
      if (order.order_status === "cancelled" || order.order_status === "delivered") return sum;
      return sum + order.quantity;
    }, 0);

    const receivedByPurchase = new Map<string, number>();
    for (const receipt of get().goodsReceipts) {
      if (!receipt.purchase_id) continue;
      receivedByPurchase.set(
        receipt.purchase_id,
        (receivedByPurchase.get(receipt.purchase_id) || 0) + receipt.quantity_received,
      );
    }

    const ordered = get().purchases.reduce((sum, purchase) => {
      if (purchase.item_id !== itemId) return sum;
      const received = purchase.id ? receivedByPurchase.get(purchase.id) || 0 : 0;
      const remaining = Math.max(0, purchase.quantity - received);
      return sum + remaining;
    }, 0);

    const available = onHand - committed + ordered;
    if (quantity > available) {
      const safeAvailable = Math.max(0, available);
      return {
        ok: false,
        message: locale === "en"
          ? `Insufficient stock. Available: ${safeAvailable} ${selectedItem.default_uom}.`
          : `Stok tidak mencukupi. Tersedia: ${safeAvailable} ${selectedItem.default_uom}.`,
      };
    }
    const sellingPriceFromMaster = get().priceMasters.find((price) => price.item_id === itemId && price.price_type === "selling")?.price_value;
    const unitPrice = sellingPriceFromMaster ?? selectedItem.selling_price;
    const soNumber = nextSequenceNumber("SO", get().orders);

    const newOrder: Order = {
      id: makeId("SO"),
      so_number: soNumber,
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

    return {
      ok: true,
      message: locale === "en" ? "Order saved with Pending status." : "Pesanan berhasil dicatat dengan status Pending.",
    };
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => {
      let deliveryStock: Stock | null = null;

      const updatedOrders = state.orders.map((order) => {
        if (order.id !== orderId) return order;
        if (status === "paid") return order;
        if (status === "delivered" && order.payment_status !== "paid") return order;

        const paymentStatus = status === "cancelled"
          ? "cancelled"
          : order.payment_status;

        if (status === "delivered" && order.order_status !== "delivered") {
          const latestStockForItem = state.stocks.find((row) => row.item_id === order.item_id);
          const selectedWarehouse = latestStockForItem
            ? { id: latestStockForItem.warehouse_id, name: latestStockForItem.warehouse_name }
            : { id: "WH-001", name: "Gudang Telur" };

          deliveryStock = {
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
        }

        return {
          ...order,
          order_status: status,
          payment_status: paymentStatus,
          receipt_confirmed: status === "delivered" ? true : order.receipt_confirmed,
        };
      });

      return {
        orders: updatedOrders,
        stocks: deliveryStock ? [deliveryStock, ...state.stocks] : state.stocks,
      };
    });
  },

  addPurchase: ({ vendorName, itemId, itemName, quantity, unit, unitPrice, category }) => {
    const selectedItem = get().itemMasters.find((item) => item.id === itemId);
    if (!selectedItem || !selectedItem.is_active) return;

    const activeUserId = get().currentUserId ?? "USR-001";
    const total = quantity * unitPrice;
    const poNumber = nextSequenceNumber("PO", get().purchases);
    const newPurchase: Purchase = {
      id: makeId("PO"),
      po_number: poNumber,
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

    set((state) => ({
      payments: [newPayment, ...state.payments],
      journals: [newJournal, ...state.journals],
      orders: state.orders.map((order) => {
        if (!isIncoming || !referenceId || order.id !== referenceId) return order;
        return {
          ...order,
          payment_status: "paid",
          order_status: "paid",
          payment_method: method,
          payment_id: newPayment.id,
          receipt_confirmed: order.receipt_confirmed,
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
    if (!selectedItem || !selectedItem.is_active || !selectedWarehouse || !selectedWarehouse.is_active) return;

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

    set((state) => {
      const hasEggItem = state.itemMasters.some((item) => item.sku === DEFAULT_EGG_SKU);
      const updatedItems = hasEggItem
        ? state.itemMasters.map((item) =>
          item.sku === DEFAULT_EGG_SKU
            ? { ...item, selling_price: pricePerKg }
            : item,
        )
        : [buildDefaultEggItem(pricePerKg), ...state.itemMasters];

      return {
        prices: [newPrice, ...state.prices],
        itemMasters: updatedItems,
      };
    });
  },

  addItemMaster: ({ sku, name, category, defaultUom, purchasePrice, sellingPrice, minStock, description, isActive }) => {
    const selectedUom = get().unitOfMeasures.find((uom) => uom.symbol === defaultUom);
    if (!selectedUom || !selectedUom.is_active) return;

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
      is_active: isActive ?? true,
      created_at: nowIso(),
    };

    set((state) => ({ itemMasters: [newItem, ...state.itemMasters] }));
  },

  toggleItemMaster: (itemId) => {
    set((state) => ({
      itemMasters: state.itemMasters.map((item) =>
        item.id === itemId
          ? { ...item, is_active: !item.is_active }
          : item,
      ),
    }));
  },

  addUnitOfMeasure: ({ name, symbol, description, isActive }) => {
    const newUom: UnitOfMeasure = {
      id: makeId("UOM"),
      name,
      symbol,
      description,
      is_active: isActive ?? true,
      created_at: nowIso(),
    };

    set((state) => ({ unitOfMeasures: [newUom, ...state.unitOfMeasures] }));
  },

  toggleUnitOfMeasure: (uomId) => {
    set((state) => ({
      unitOfMeasures: state.unitOfMeasures.map((uom) =>
        uom.id === uomId
          ? { ...uom, is_active: !uom.is_active }
          : uom,
      ),
    }));
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
    const selectedItem = get().itemMasters.find((item) => item.id === itemId);
    const selectedUom = get().unitOfMeasures.find((uomRow) => uomRow.symbol === uom);
    if (!selectedItem || !selectedItem.is_active || !selectedUom || !selectedUom.is_active) return;

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

  addChartOfAccount: ({ code, name, category, isActive }) => {
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const locale = get().locale;
    if (!trimmedCode || !trimmedName) {
      return {
        ok: false,
        message: locale === "en" ? "Account code and name are required." : "Kode dan nama akun wajib diisi.",
      };
    }

    const exists = get().chartOfAccounts.some((account) => account.code === trimmedCode);
    if (exists) {
      return {
        ok: false,
        message: locale === "en" ? "COA code is already registered." : "Kode COA sudah terdaftar.",
      };
    }

    const newAccount: ChartOfAccount = {
      id: makeId("COA"),
      code: trimmedCode,
      name: trimmedName,
      category,
      is_active: isActive ?? true,
      created_at: nowIso(),
    };

    set((state) => ({ chartOfAccounts: [newAccount, ...state.chartOfAccounts] }));
    return {
      ok: true,
      message: locale === "en" ? "COA added successfully." : "COA berhasil ditambahkan.",
    };
  },

  toggleChartOfAccount: (accountId) => {
    set((state) => ({
      chartOfAccounts: state.chartOfAccounts.map((account) =>
        account.id === accountId
          ? { ...account, is_active: !account.is_active }
          : account,
      ),
    }));
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
    isActive,
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
      is_active: isActive ?? true,
      total_transaction_rp: 0,
      transaction_count: 0,
      notes,
      created_at: nowIso(),
    };

    set((state) => ({ masterParties: [newParty, ...state.masterParties] }));
  },

  toggleMasterParty: (partyId) => {
    set((state) => ({
      masterParties: state.masterParties.map((party) =>
        party.id === partyId
          ? { ...party, is_active: !party.is_active }
          : party,
      ),
    }));
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
