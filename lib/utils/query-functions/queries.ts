// =============================================================================
// PUBMARKET — SUPABASE QUERY FUNCTIONS
// lib/supabase/queries.ts
// =============================================================================
// All functions use the server client (cookies-based session).
// For client components, swap createClient import to the browser client.
// Every function returns APIResponse<T> — never throws.
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import type { APIResponse, PaginatedResponse } from "@/types/database";
import type {
  DbProfile,
  DbSellerProfile,
  DbCategory,
  DbProduct,
  DbProductImage,
  DbAddress,
  DbOrder,
  DbOrderItem,
  DbCartItem,
  DbReview,
  DbWishlist,
  DbNotification,
  DbConversation,
  DbMessage,
  DbSupportTicket,
  DbSupportMessage,
  DbInventoryLog,
  DbSellerAnalytics,
} from "@/lib/types";

// =============================================================================
// PROFILES
// =============================================================================

export async function getProfile(
  userId: string,
): Promise<APIResponse<DbProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Profile not found." };
  return { success: true, data };
}

export async function getCurrentProfile(): Promise<APIResponse<DbProfile>> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user)
    return { success: false, error: "Not authenticated." };
  return getProfile(user.id);
}

export async function updateProfile(
  userId: string,
  payload: Partial<
    Pick<
      DbProfile,
      | "full_name"
      | "phone"
      | "avatar_url"
      | "province"
      | "city"
      | "barangay"
      | "postal_code"
      | "completed_onboarding"
    >
  >,
): Promise<APIResponse<DbProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Update failed." };
  return { success: true, data };
}

// =============================================================================
// SELLER PROFILES
// =============================================================================

export async function getSellerProfile(
  sellerId: string,
): Promise<APIResponse<DbSellerProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("id", sellerId)
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Seller not found." };
  return { success: true, data };
}

export async function getSellerProfileByUserId(
  userId: string,
): Promise<APIResponse<DbSellerProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Seller profile not found.",
    };
  return { success: true, data };
}

export async function createSellerProfile(payload: {
  user_id: string;
  shop_name: string;
  shop_description?: string;
  province: string;
  city: string;
  barangay: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  bir_document_url?: string;
  bir_tin?: string;
}): Promise<APIResponse<DbSellerProfile>> {
  const supabase = await createClient();

  // 1. Double check existence (Safety first)
  const { data: check } = await supabase
    .from("seller_profiles")
    .select("id")
    .eq("user_id", payload.user_id)
    .maybeSingle();

  if (check) {
    return {
      success: false,
      error: "A seller profile already exists for this account.",
    };
  }

  // 2. Insert new profile
  const { data, error } = await supabase
    .from("seller_profiles")
    .insert({ ...payload, status: "pending" })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Failed to create seller profile.",
    };
  }

  // 3. Mirror seller_status on profiles table
  // We keep role as 'seller' or maybe 'pending_seller' depending on your RBAC
  await supabase
    .from("profiles")
    .update({ seller_status: "pending", role: "seller" })
    .eq("id", payload.user_id);

  return { success: true, data };
}

export async function updateSellerProfile(
  sellerId: string,
  payload: Partial<
    Pick<
      DbSellerProfile,
      | "shop_name"
      | "shop_description"
      | "shop_banner_url"
      | "shop_logo_url"
      | "province"
      | "city"
      | "barangay"
      | "full_address"
      | "latitude"
      | "longitude"
      | "bir_document_url"
      | "bir_tin"
    >
  >,
): Promise<APIResponse<DbSellerProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_profiles")
    .update(payload)
    .eq("id", sellerId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Update failed." };
  return { success: true, data };
}

// Admin only
export async function getAllSellersAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seller_profiles")
    .select(
      `
      *,
      owner:profiles!seller_profiles_user_id_fkey (
        full_name,
        email,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sellers:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function approveSellerProfile(
  sellerId: string,
  adminId: string,
): Promise<APIResponse<DbSellerProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_profiles")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: adminId,
    })
    .eq("id", sellerId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Approval failed." };

  // Mirror on profiles
  await supabase
    .from("profiles")
    .update({ seller_status: "approved" })
    .eq("id", data.user_id);

  return { success: true, data };
}

export async function rejectSellerProfile(
  sellerId: string,
  reason: string,
): Promise<APIResponse<DbSellerProfile>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_profiles")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", sellerId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Rejection failed." };

  await supabase
    .from("profiles")
    .update({ seller_status: "rejected" })
    .eq("id", data.user_id);

  return { success: true, data };
}

// =============================================================================
// CATEGORIES
// =============================================================================

export async function getCategories(): Promise<APIResponse<DbCategory[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function getCategoryBySlug(
  slug: string,
): Promise<APIResponse<DbCategory>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return { success: false, error: "Category not found." };
  return { success: true, data };
}

// =============================================================================
// PRODUCTS
// =============================================================================

export async function getProducts(opts?: {
  categorySlug?: string;
  province?: string;
  city?: string;
  sellerId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<DbProduct>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("products")
    .select(
      "*, seller:seller_profiles(id, shop_name, shop_logo_url, average_rating), category:categories(id, name, slug, icon)",
      { count: "exact" },
    )
    .eq("is_active", true)
    .eq("is_draft", false);

  if (opts?.sellerId) query = query.eq("seller_id", opts.sellerId);
  if (opts?.province) query = query.eq("province", opts.province);
  if (opts?.city) query = query.eq("city", opts.city);
  if (opts?.minPrice) query = query.gte("price", opts.minPrice);
  if (opts?.maxPrice) query = query.lte("price", opts.maxPrice);

  if (opts?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (opts?.search) {
    query = query.textSearch("search_vector", opts.search, {
      type: "websearch",
    });
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getProductBySlug(slug: string): Promise<
  APIResponse<
    DbProduct & {
      images: DbProductImage[];
      reviews: (DbReview & {
        customer: Pick<DbProfile, "id" | "full_name" | "avatar_url">;
      })[];
    }
  >
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      seller:seller_profiles(*),
      category:categories(*),
      images:product_images(* order by sort_order asc),
      reviews:reviews(*, customer:profiles(id, full_name, avatar_url))
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("is_draft", false)
    .single();

  if (error || !data) return { success: false, error: "Product not found." };
  return { success: true, data };
}

export async function getProductById(
  productId: string,
): Promise<APIResponse<DbProduct>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !data) return { success: false, error: "Product not found." };
  return { success: true, data };
}

// Seller's own products — includes drafts and inactive
export async function getSellerProducts(
  sellerId: string,
): Promise<APIResponse<DbProduct[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug, icon)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function createProduct(payload: {
  seller_id: string;
  category_id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  stock: number;
  low_stock_threshold?: number;
  unit?: string;
  province: string;
  city: string;
  barangay: string;
  thumbnail_url?: string;
  is_draft?: boolean;
  ai_generated_description?: boolean;
}): Promise<APIResponse<DbProduct>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to create product.",
    };
  return { success: true, data };
}

export async function updateProduct(
  productId: string,
  payload: Partial<
    Pick<
      DbProduct,
      | "name"
      | "slug"
      | "description"
      | "price"
      | "original_price"
      | "stock"
      | "low_stock_threshold"
      | "unit"
      | "thumbnail_url"
      | "is_active"
      | "is_draft"
      | "is_featured"
      | "category_id"
      | "ai_generated_description"
    >
  >,
): Promise<APIResponse<DbProduct>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", productId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Update failed." };
  return { success: true, data };
}

export async function deleteProduct(productId: string): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Product deleted." };
}

// =============================================================================
// PRODUCT IMAGES
// =============================================================================

export async function addProductImage(payload: {
  product_id: string;
  url: string;
  alt_text?: string;
  sort_order?: number;
}): Promise<APIResponse<DbProductImage>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_images")
    .insert(payload)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Failed to add image." };
  return { success: true, data };
}

export async function deleteProductImage(
  imageId: string,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Image deleted." };
}

export async function reorderProductImages(
  updates: { id: string; sort_order: number }[],
): Promise<APIResponse> {
  const supabase = await createClient();
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from("product_images").update({ sort_order }).eq("id", id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return { success: false, error: failed.error.message };
  return { success: true, message: "Images reordered." };
}

// =============================================================================
// ADDRESSES
// =============================================================================

export async function getAddresses(
  userId: string,
): Promise<APIResponse<DbAddress[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function createAddress(payload: {
  user_id: string;
  label?: string;
  full_name: string;
  phone: string;
  province: string;
  city: string;
  barangay: string;
  street: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  is_default?: boolean;
}): Promise<APIResponse<DbAddress>> {
  const supabase = await createClient();

  // If new address is default, clear existing defaults first
  if (payload.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", payload.user_id);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert(payload)
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to save address.",
    };
  return { success: true, data };
}

export async function updateAddress(
  addressId: string,
  userId: string,
  payload: Partial<
    Omit<DbAddress, "id" | "user_id" | "created_at" | "updated_at">
  >,
): Promise<APIResponse<DbAddress>> {
  const supabase = await createClient();

  if (payload.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .update(payload)
    .eq("id", addressId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Update failed." };
  return { success: true, data };
}

export async function deleteAddress(addressId: string): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId);
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Address deleted." };
}

// =============================================================================
// CART
// =============================================================================

export async function getCart(
  userId: string,
): Promise<APIResponse<(DbCartItem & { product: DbProduct })[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      "*, product:products(*, category:categories(id, name, slug, icon), seller:seller_profiles(id, shop_name, shop_logo_url))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function upsertCartItem(
  userId: string,
  productId: string,
  quantity: number,
): Promise<APIResponse<DbCartItem>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cart_items")
    .upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: "user_id,product_id" },
    )
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to update cart.",
    };
  return { success: true, data };
}

export async function removeCartItem(
  userId: string,
  productId: string,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Item removed from cart." };
}

export async function clearCart(userId: string): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);
  if (error) return { success: false, error: error.message };
  return { success: true, message: "Cart cleared." };
}

// =============================================================================
// WISHLIST
// =============================================================================

export async function getWishlist(
  userId: string,
): Promise<APIResponse<(DbWishlist & { product: DbProduct })[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select(
      "*, product:products(*, seller:seller_profiles(id, shop_name, shop_logo_url, average_rating), category:categories(id, name, slug, icon))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function addToWishlist(
  userId: string,
  productId: string,
): Promise<APIResponse<DbWishlist>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to add to wishlist.",
    };
  return { success: true, data };
}

export async function removeFromWishlist(
  userId: string,
  productId: string,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Removed from wishlist." };
}

export async function isInWishlist(
  userId: string,
  productId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();
  return !!data;
}

// =============================================================================
// ORDERS
// =============================================================================

export async function getCustomerOrders(
  customerId: string,
  opts?: { status?: string; page?: number; pageSize?: number },
): Promise<PaginatedResponse<DbOrder>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("orders")
    .select(
      "*, seller:seller_profiles(id, shop_name, shop_logo_url), items:order_items(*)",
      { count: "exact" },
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.status) query = query.eq("status", opts.status);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getSellerOrders(
  sellerId: string,
  opts?: { status?: string; page?: number; pageSize?: number },
): Promise<PaginatedResponse<DbOrder>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("orders")
    .select(
      "*, customer:profiles(id, full_name, avatar_url, phone), items:order_items(*)",
      { count: "exact" },
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.status) query = query.eq("status", opts.status);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getOrderById(orderId: string): Promise<
  APIResponse<
    DbOrder & {
      items: DbOrderItem[];
      customer: Pick<DbProfile, "id" | "full_name" | "avatar_url" | "phone">;
      seller: DbSellerProfile;
    }
  >
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, items:order_items(*), customer:profiles(id, full_name, avatar_url, phone), seller:seller_profiles(*)",
    )
    .eq("id", orderId)
    .single();

  if (error || !data) return { success: false, error: "Order not found." };
  return { success: true, data };
}

export async function createOrder(payload: {
  customer_id: string;
  seller_id: string;
  delivery_address: object;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method?: string;
  customer_notes?: string;
  seller_latitude?: number;
  seller_longitude?: number;
  buyer_latitude?: number;
  buyer_longitude?: number;
  items: {
    product_id: string;
    product_name: string;
    product_image?: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
  }[];
}): Promise<APIResponse<DbOrder>> {
  const supabase = await createClient();
  const { items, ...orderPayload } = payload;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ ...orderPayload, status: "pending", payment_status: "unpaid" })
    .select()
    .single();

  if (orderError || !order)
    return {
      success: false,
      error: orderError?.message ?? "Failed to create order.",
    };

  // Insert order items
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    // Rollback order if items fail
    await supabase.from("orders").delete().eq("id", order.id);
    return { success: false, error: "Failed to save order items." };
  }

  // Clear customer's cart
  await supabase.from("cart_items").delete().eq("user_id", payload.customer_id);

  return { success: true, data: order, message: "Order placed successfully." };
}

export async function updateOrderStatus(
  orderId: string,
  status: DbOrder["status"],
  extra?: { cancellation_reason?: string },
): Promise<APIResponse<DbOrder>> {
  const supabase = await createClient();

  const timestampMap: Record<string, string> = {
    confirmed: "confirmed_at",
    packed: "packed_at",
    out_for_delivery: "out_for_delivery_at",
    delivered: "delivered_at",
    cancelled: "cancelled_at",
  };

  const updatePayload: Record<string, unknown> = { status };
  if (timestampMap[status])
    updatePayload[timestampMap[status]] = new Date().toISOString();
  if (extra?.cancellation_reason)
    updatePayload.cancellation_reason = extra.cancellation_reason;

  // When delivered, also mark payment as paid (mock)
  if (status === "delivered") updatePayload.payment_status = "paid";

  const { data, error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", orderId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Status update failed." };
  return { success: true, data };
}

// =============================================================================
// REVIEWS
// =============================================================================

export async function getProductReviews(productId: string): Promise<
  APIResponse<
    (DbReview & {
      customer: Pick<DbProfile, "id" | "full_name" | "avatar_url">;
    })[]
  >
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, customer:profiles(id, full_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function createReview(payload: {
  product_id: string;
  seller_id: string;
  customer_id: string;
  order_id: string;
  rating: number;
  comment?: string;
}): Promise<APIResponse<DbReview>> {
  const supabase = await createClient();

  // Verify the order is delivered and belongs to the customer
  const { data: order } = await supabase
    .from("orders")
    .select("id, status, customer_id")
    .eq("id", payload.order_id)
    .single();

  if (
    !order ||
    order.status !== "delivered" ||
    order.customer_id !== payload.customer_id
  ) {
    return {
      success: false,
      error: "You can only review products from delivered orders.",
    };
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert(payload)
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to submit review.",
    };

  // Update review_id on the matching order_item
  await supabase
    .from("order_items")
    .update({ review_id: data.id })
    .eq("order_id", payload.order_id)
    .eq("product_id", payload.product_id);

  return { success: true, data, message: "Review submitted." };
}

export async function updateReview(
  reviewId: string,
  customerId: string,
  payload: { rating?: number; comment?: string },
): Promise<APIResponse<DbReview>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .update(payload)
    .eq("id", reviewId)
    .eq("customer_id", customerId)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Update failed." };
  return { success: true, data };
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export async function getNotifications(
  userId: string,
  opts?: { unreadOnly?: boolean; page?: number; pageSize?: number },
): Promise<PaginatedResponse<DbNotification>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.unreadOnly) query = query.eq("is_read", false);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function markNotificationRead(
  notificationId: string,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function markAllNotificationsRead(
  userId: string,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// =============================================================================
// CONVERSATIONS & MESSAGES
// =============================================================================

export async function getConversations(
  userId: string,
): Promise<APIResponse<DbConversation[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      "*, seller:seller_profiles(id, shop_name, shop_logo_url, user_id), customer:profiles(id, full_name, avatar_url), product:products(id, name, thumbnail_url)",
    )
    .or(
      `customer_id.eq.${userId},seller_id.in.(select id from seller_profiles where user_id = '${userId}')`,
    )
    .order("last_message_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function getOrCreateConversation(
  customerId: string,
  sellerId: string,
  productId?: string,
): Promise<APIResponse<DbConversation>> {
  const supabase = await createClient();

  // Try to get existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("customer_id", customerId)
    .eq("seller_id", sellerId)
    .single();

  if (existing) return { success: true, data: existing };

  // Create new
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      customer_id: customerId,
      seller_id: sellerId,
      product_id: productId ?? null,
    })
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to start conversation.",
    };
  return { success: true, data };
}

export async function getMessages(conversationId: string): Promise<
  APIResponse<
    (DbMessage & {
      sender: Pick<DbProfile, "id" | "full_name" | "avatar_url">;
    })[]
  >
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles(id, full_name, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function sendMessage(payload: {
  conversation_id: string;
  sender_id: string;
  body: string;
}): Promise<APIResponse<DbMessage>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert(payload)
    .select()
    .single();

  if (error || !data)
    return {
      success: false,
      error: error?.message ?? "Failed to send message.",
    };

  // Update conversation last_message
  await supabase
    .from("conversations")
    .update({
      last_message: payload.body,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", payload.conversation_id);

  return { success: true, data };
}

// =============================================================================
// SUPPORT TICKETS
// =============================================================================

export async function getSupportTickets(
  userId: string,
): Promise<APIResponse<DbSupportTicket[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function createSupportTicket(payload: {
  user_id: string;
  subject: string;
  category: DbSupportTicket["category"];
  order_id?: string;
  product_id?: string;
  initial_message: string;
}): Promise<APIResponse<DbSupportTicket>> {
  const supabase = await createClient();
  const { initial_message, ...ticketPayload } = payload;

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert({ ...ticketPayload, status: "open" })
    .select()
    .single();

  if (ticketError || !ticket)
    return {
      success: false,
      error: ticketError?.message ?? "Failed to create ticket.",
    };

  // Insert first message
  await supabase.from("support_messages").insert({
    ticket_id: ticket.id,
    sender_id: payload.user_id,
    body: initial_message,
    is_staff: false,
  });

  return { success: true, data: ticket, message: "Support ticket created." };
}

export async function getSupportMessages(ticketId: string): Promise<
  APIResponse<
    (DbSupportMessage & {
      sender: Pick<DbProfile, "id" | "full_name" | "avatar_url">;
    })[]
  >
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_messages")
    .select("*, sender:profiles(id, full_name, avatar_url)")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function replySupportTicket(payload: {
  ticket_id: string;
  sender_id: string;
  body: string;
  is_staff: boolean;
}): Promise<APIResponse<DbSupportMessage>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_messages")
    .insert(payload)
    .select()
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Failed to send reply." };
  return { success: true, data };
}

// =============================================================================
// INVENTORY LOGS
// =============================================================================

export async function getInventoryLogs(
  sellerId: string,
  productId?: string,
): Promise<APIResponse<DbInventoryLog[]>> {
  const supabase = await createClient();

  let query = supabase
    .from("inventory_logs")
    .select("*, product:products(id, name, thumbnail_url)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (productId) query = query.eq("product_id", productId);

  const { data, error } = await query;
  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

// =============================================================================
// SELLER ANALYTICS
// =============================================================================

export async function getSellerAnalytics(
  sellerId: string,
  opts?: { from?: string; to?: string },
): Promise<APIResponse<DbSellerAnalytics[]>> {
  const supabase = await createClient();

  let query = supabase
    .from("seller_analytics")
    .select("*")
    .eq("seller_id", sellerId)
    .order("date", { ascending: true });

  if (opts?.from) query = query.gte("date", opts.from);
  if (opts?.to) query = query.lte("date", opts.to);

  const { data, error } = await query;
  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

// =============================================================================
// ADMIN QUERIES
// =============================================================================

export async function getAllUsers(opts?: {
  role?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<DbProfile>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.role) query = query.eq("role", opts.role);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getPendingSellerApplications(): Promise<
  APIResponse<
    (DbSellerProfile & {
      owner: DbProfile;
    })[]
  >
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seller_profiles")
    .select("*, owner:profiles(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: data ?? [] };
}

export async function suspendUser(
  userId: string,
  suspend: boolean,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ is_suspended: suspend })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };
  return {
    success: true,
    message: suspend ? "User suspended." : "User unsuspended.",
  };
}

export async function getAllOrders(opts?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<DbOrder>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("orders")
    .select(
      "*, customer:profiles(id, full_name, avatar_url), seller:seller_profiles(id, shop_name)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.status) query = query.eq("status", opts.status);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getAllSupportTickets(opts?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<DbSupportTicket>> {
  const supabase = await createClient();
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("support_tickets")
    .select("*, user:profiles(id, full_name, avatar_url, email)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts?.status) query = query.eq("status", opts.status);

  const { data, error, count } = await query;
  if (error) return { success: false, error: error.message };

  const total = count ?? 0;
  return {
    success: true,
    data: {
      items: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function flagReview(
  reviewId: string,
  flagReason: string,
): Promise<APIResponse> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_flagged: true, flag_reason: flagReason })
    .eq("id", reviewId);

  if (error) return { success: false, error: error.message };
  return { success: true, message: "Review flagged." };
}

// =============================================================================
// END OF QUERIES
// =============================================================================
