export type Order = {
  id: string;
  customerId: string;
  sellerId: string;
  deliveryAddress: DeliveryAddressSnapshot;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  paymentReference: string | null;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  sellerCoords: Coords | null;
  buyerCoords: Coords | null;
  timeline: OrderTimeline;
  cancellationReason: string | null;
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderTimeline = {
  confirmedAt: string | null;
  packedAt: string | null;
  outForDeliveryAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  reviewId: string | null;
};

// Full order for detail pages
export type OrderWithDetails = Order & {
  customer: User;
  seller: Seller;
  items: OrderItem[];
};

// Lightweight order for list/history views
export type OrderSummary = {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  seller: {
    id: string;
    shopName: string;
    shopLogoUrl: string | null;
  };
  items: {
    productName: string;
    productImage: string | null;
    quantity: number;
  }[];
};
