"use client";

import Link from "next/link";
import {
  Package,
  ChevronRight,
  Store,
  MapPin,
  Star,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  mockCurrentUser,
  mockFeaturedProducts,
  mockOrderSummaries,
  mockNotifications,
  mockCategories,
} from "@/lib/mockup/pubMarket-data-mockup";
import type { ProductCard, OrderSummary, Notification, Category } from "@/lib/types";
import { useEffect, useState } from "react";
import { ProductCategorySkeletonV1 } from "@/components/custom/skeleton/productCategorySkeleton";
import { ActiveOrdersSkeletonV1 } from "@/components/custom/skeleton/activeOrdersSkeleton";
import { BecomeASellerCTASkeletonV1 } from "@/components/custom/skeleton/ctaSkeletons";
import { ProductSkeletonV1 } from "@/components/custom/skeleton/productsSkeleton";

// ── ORDER STATUS CONFIG ──
const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-warning-bg text-warning-fg" },
  confirmed: { label: "Confirmed", color: "bg-pm-green-100 text-pm-green-800" },
  packed: { label: "Packed", color: "bg-pm-green-100 text-pm-green-800" },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-pm-gold-100 text-pm-gold-800",
  },
  delivered: { label: "Delivered", color: "bg-success-bg text-success-fg" },
  cancelled: { label: "Cancelled", color: "bg-danger-bg text-danger-fg" },
};

// ── PRODUCT CARD COMPONENT ──
function ProductCardItem({ product }: { product: ProductCard }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img
            src={product.thumbnailUrl ?? "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-destructive text-white text-[10px] px-1.5 py-0.5 border-0">
              -{discount}%
            </Badge>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute top-2 right-2 bg-warning-bg text-warning-fg text-[10px] px-1.5 py-0.5 border-0">
              Low Stock
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground truncate">
            {product.seller.shopName}
          </p>
          <p className="text-sm font-medium line-clamp-2 mt-0.5 leading-snug">
            {product.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-pm-gold-500 text-pm-gold-500" />
            <span className="text-xs text-muted-foreground">
              {product.averageRating} ({product.totalReviews})
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-bold text-primary">
              ₱{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₱{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              {product.location.city}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── ACTIVE ORDER STRIP ──
function ActiveOrderStrip({ order }: { order: OrderSummary }) {
  const config = statusConfig[order.status];
  return (
    <Link href={`/orders/${order.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
        <div className="w-10 h-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
          <img
            src={order.items[0]?.productImage ?? "/placeholder.png"}
            alt={order.items[0]?.productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {order.seller.shopName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {order.items.map((i) => i.productName).join(", ")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={`text-[10px] px-2 py-0.5 border-0 ${config.color}`}>
            {config.label}
          </Badge>
          <span className="text-xs font-semibold text-foreground">
            ₱{order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── NOTIFICATION ITEM ──
function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={`flex gap-3 p-3 rounded-lg border transition-colors ${!notification.isRead ? "bg-accent/50 border-pm-green-200" : "bg-card border-border"}`}
    >
      <div
        className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 opacity-0 data-[unread=true]:opacity-100"
        data-unread={!notification.isRead}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {notification.body}
        </p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
export default function DashboardPage() {
  const firstName = mockCurrentUser.fullName.split(" ")[0];
  const recentNotifs = mockNotifications
    .filter((n) => n.userId === mockCurrentUser.id)
    .slice(0, 3);
  const isSeller = mockCurrentUser.sellerStatus === "approved";

  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [productCategories, setProductCategories] = useState<{success: boolean;categoryData: Category[]}>({success: false, categoryData: []});
  const [activeOrdersLoading, setActiveOrdersLoading] = useState<boolean>(true);
  const [activeOrders, setActiveOrders] = useState<{success: boolean; activeOrdersData: OrderSummary[]}>({success: false, activeOrdersData: []});
  const [currentUserIsSellerLoading, setCurrentUserIsSellerLoading] = useState<boolean>(true);
  const [currentUserIsSeller, setCurrentUserIsSeller] = useState<boolean>(false);


  const fetchCategories = async () => {
    setCategoriesLoading(true);
    const res = await fetch("/api/categories");
    const result = await res.json();
    console.log(result);
    if (!result.success) {
      setCategoriesLoading(false);
      setProductCategories({success: false, categoryData: []});
      return;
    }
    setProductCategories({success: true, categoryData: result.data});
    setCategoriesLoading(false);
  };
  
  const fetchActiveOrders = async () => {
    setCategoriesLoading(true);
    const res = await fetch("/api/orders/activeOrders");
    const result = await res.json();
    console.log(result);
    if (!result.success) {
      setActiveOrdersLoading(false);
      setActiveOrders({success: false, activeOrdersData: []});
      return;
    }
    setActiveOrders({success: true, activeOrdersData: result.data});
    setActiveOrdersLoading(false);
  };

  const fetchIsUseSeller = async () => {
    setCurrentUserIsSellerLoading(true);
    const res = await fetch("/api/seller/apply", {
      method: "POST",
    });
    const result = await res.json();
    console.log(result);
    if (!result.success && result.error === "ALREADY_APPROVED") {
      setCurrentUserIsSellerLoading(false);
      setCurrentUserIsSeller(true);
      return;
    }
    setCurrentUserIsSeller(true);
    setCurrentUserIsSellerLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchActiveOrders();
    fetchIsUseSeller();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* ── GREETING ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hello, {firstName}! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {mockCurrentUser.location?.city},{" "}
            {mockCurrentUser.location?.province}
          </p>
        </div>
        {!isSeller && (
          <Link href="/seller/apply">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sell on PubMarket</span>
              <span className="sm:hidden">Sell</span>
            </Button>
          </Link>
        )}
      </div>

      {/* ── CATEGORIES SCROLL ── */}
      <section>
        <h2 className="text-base font-semibold mb-3">Browse by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {
            categoriesLoading && <ProductCategorySkeletonV1 />
          }
          { productCategories.success && productCategories.categoryData.length > 0 && productCategories.categoryData.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card hover:bg-accent hover:border-pm-green-200 transition-colors w-20"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] text-center font-medium leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ACTIVE ORDERS ── */}
      {
        activeOrdersLoading && !activeOrders.success && <ActiveOrdersSkeletonV1 />
      }
      {activeOrders?.activeOrdersData.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Active Orders
            </h2>
            <Link href="/orders">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7 px-2"
              >
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {activeOrders.activeOrdersData.map((order) => (
              <ActiveOrderStrip key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}

      {/* ── BECOME A SELLER CTA ── */}
      {
        currentUserIsSellerLoading ? (
        <BecomeASellerCTASkeletonV1 />) : (
        currentUserIsSeller ? (<Card className="border-pm-green-200 bg-pm-green-50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-pm-green-800">
                Start selling on PubMarket
              </p>
              <p className="text-xs text-pm-green-700 mt-0.5">
                Reach local customers and grow your business.
              </p>
            </div>
            <Link href="/seller/apply">
              <Button size="sm" className="flex-shrink-0">
                Apply Now
              </Button>
            </Link>
          </CardContent>
        </Card>) : null
      )}

      {/* ── FEATURED / TRENDING PRODUCTS ── */}
      <ProductSkeletonV1 />
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            Trending Near You
          </h2>
          <Link href="/products">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary h-7 px-2"
            >
              See all <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {mockFeaturedProducts.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── NOTIFICATIONS PREVIEW ── */}
      {recentNotifs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Notifications</h2>
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7 px-2"
              >
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {recentNotifs.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
