import { InventoryChangeReason, NotificationType, OrderStatus, PaymentStatus, TicketCategory, TicketStatus, UserRole } from "./union.types";
import { SellerStatus } from "./union.types";

export type DbProfile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  province: string | null;
  city: string | null;
  barangay: string | null;
  postal_code: string | null;
  seller_status: SellerStatus | null;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
};

export type DbSellerProfile = {
  id: string;
  user_id: string;
  shop_name: string;
  shop_description: string | null;
  shop_banner_url: string | null;
  shop_logo_url: string | null;
  province: string;
  city: string;
  barangay: string;
  full_address: string | null;
  latitude: number | null;
  longitude: number | null;
  bir_document_url: string | null;
  bir_tin: string | null;
  status: SellerStatus;
  rejection_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
  total_sales: number;
  total_orders: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
};

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

export type DbProduct = {
  id: string;
  seller_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock: number;
  low_stock_threshold: number;
  unit: string;
  province: string;
  city: string;
  barangay: string;
  thumbnail_url: string | null;
  is_active: boolean;
  is_draft: boolean;
  is_featured: boolean;
  ai_generated_description: boolean;
  average_rating: number;
  total_reviews: number;
  total_sold: number;
  search_vector: string | null;
  created_at: string;
  updated_at: string;
};

export type DbProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
};

export type DbAddress = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

export type DbOrder = {
  id: string;
  customer_id: string;
  seller_id: string;
  delivery_address: DbDeliveryAddressSnapshot;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_reference: string | null;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  seller_latitude: number | null;
  seller_longitude: number | null;
  buyer_latitude: number | null;
  buyer_longitude: number | null;
  confirmed_at: string | null;
  packed_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  customer_notes: string | null;
  created_at: string;
  updated_at: string;
};

// JSONB snapshot stored inside orders.delivery_address
export type DbDeliveryAddressSnapshot = {
  full_name: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type DbOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  review_id: string | null;
  created_at: string;
};

export type DbCartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type DbReview = {
  id: string;
  product_id: string;
  seller_id: string;
  customer_id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type DbWishlist = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type DbNotification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
};

export type DbConversation = {
  id: string;
  customer_id: string;
  seller_id: string;
  product_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count_customer: number;
  unread_count_seller: number;
  created_at: string;
  updated_at: string;
};

export type DbMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export type DbSupportTicket = {
  id: string;
  user_id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  order_id: string | null;
  product_id: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DbSupportMessage = {
  id: string;
  ticket_id: string;
  sender_id: string;
  body: string;
  is_staff: boolean;
  created_at: string;
};

export type DbInventoryLog = {
  id: string;
  product_id: string;
  seller_id: string;
  change: number;
  reason: InventoryChangeReason;
  stock_before: number;
  stock_after: number;
  order_id: string | null;
  created_at: string;
};

export type DbSellerAnalytics = {
  id: string;
  seller_id: string;
  date: string;
  revenue: number;
  orders_count: number;
  units_sold: number;
  new_reviews: number;
  created_at: string;
};
