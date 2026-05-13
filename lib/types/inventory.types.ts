export type InventoryLog = {
  id: string;
  productId: string;
  sellerId: string;
  change: number;
  reason: InventoryChangeReason;
  stockBefore: number;
  stockAfter: number;
  orderId: string | null;
  createdAt: string;
};

// Product with stock info for inventory management page
export type InventoryProduct = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  stock: number;
  lowStockThreshold: number;
  unit: string;
  isActive: boolean;
  stockStatus: "ok" | "low" | "out"; // derived, not from DB
};
