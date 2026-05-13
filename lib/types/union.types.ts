export type UserRole = "customer" | "seller" | "admin";

export type SellerStatus = "pending" | "approved" | "rejected";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export type NotificationType =
  | "order_placed"
  | "order_confirmed"
  | "order_packed"
  | "order_out_for_delivery"
  | "order_delivered"
  | "order_cancelled"
  | "seller_approved"
  | "seller_rejected"
  | "new_review"
  | "low_stock"
  | "new_message"
  | "promo"
  | "system";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketCategory =
  | "order_issue"
  | "payment_issue"
  | "account_issue"
  | "seller_issue"
  | "product_issue"
  | "other";

export type InventoryChangeReason =
  | "sale"
  | "manual_update"
  | "cancellation"
  | "adjustment";
